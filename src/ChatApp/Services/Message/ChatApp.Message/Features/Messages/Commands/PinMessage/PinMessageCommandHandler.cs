namespace ChatApp.Message.Features.Messages.Commands.PinMessage;

public class PinMessageCommandHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    IKafkaProducer<MessagePinnedDto> producer,
    IOptions<KafkaOptions> kafkaOptions)
    : IRequestHandler<PinMessageCommand, PinMessageResult>
{
    private readonly KafkaOptions _kafkaOptions = kafkaOptions.Value;

    public async Task<PinMessageResult> Handle(
        PinMessageCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser()
                          ?? throw new UnauthorizedException();

        var message = await context.Messages
                          .Include(m => m.Room)
                          .FirstOrDefaultAsync(m => m.Id == request.MessageId, cancellationToken)
                      ?? throw new NotFoundException($"Message {request.MessageId} not found");

        var isUserInRoom = await context.RoomUsers
            .AnyAsync(ru => ru.RoomId == message.RoomId && ru.UserId == currentUser.Id,
                cancellationToken);

        if (!isUserInRoom)
            throw new ValidationException("User is not a member of this room");

        message.PinnedAt = DateTime.UtcNow.ToLocalTime();
        await context.SaveChangesAsync(cancellationToken);

        await producer.ProduceAsync(
            _kafkaOptions.MessagePinnedTopic,
            new MessagePinnedDto(message.Id, message.RoomId!.Value, true),
            cancellationToken);

        return new PinMessageResult
        {
            MessageId = message.Id,
            PinnedAt = message.PinnedAt,
            Success = true
        };
    }
}