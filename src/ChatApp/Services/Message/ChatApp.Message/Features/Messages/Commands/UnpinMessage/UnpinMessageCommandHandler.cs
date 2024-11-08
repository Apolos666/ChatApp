namespace ChatApp.Message.Features.Messages.Commands.UnpinMessage;

public class UnpinMessageCommandHandler : IRequestHandler<UnpinMessageCommand, UnpinMessageResult>
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IKafkaProducer<MessagePinnedDto> _producer;
    private readonly KafkaOptions _kafkaOptions;

    public UnpinMessageCommandHandler(
        ApplicationDbContext context,
        IHttpContextAccessor httpContextAccessor,
        IKafkaProducer<MessagePinnedDto> producer,
        IOptions<KafkaOptions> kafkaOptions)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _producer = producer;
        _kafkaOptions = kafkaOptions.Value;
    }

    public async Task<UnpinMessageResult> Handle(
        UnpinMessageCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = _httpContextAccessor.HttpContext?.GetCurrentUser()
                          ?? throw new UnauthorizedException();

        var message = await _context.Messages
                          .Include(m => m.Room)
                          .Include(m => m.Files)
                          .Include(m => m.Sender)
                          .FirstOrDefaultAsync(m => m.Id == request.MessageId, cancellationToken)
                      ?? throw new NotFoundException($"Message {request.MessageId} not found");

        var isUserInRoom = await _context.RoomUsers
            .AnyAsync(ru => ru.RoomId == message.RoomId && ru.UserId == currentUser.Id,
                cancellationToken);

        if (!isUserInRoom)
            throw new ValidationException("User is not a member of this room");

        message.PinnedAt = null;
        await _context.SaveChangesAsync(cancellationToken);

        await _producer.ProduceAsync(
            _kafkaOptions.MessagePinnedTopic,
            new MessagePinnedDto
            {
                Id = message.Id,
                Content = message.Content,
                PinnedAt = null,
                RoomId = message.RoomId!.Value,
                SenderId = message.SenderId!.Value,
                SenderName = message.Sender!.Name,
                IsPinned = false,
                Files = message.Files.Select(f => new FileDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Url = f.Url,
                    CreatedAt = f.CreatedAt,
                    Type = f.Name.GetMimeType()
                }).ToList()
            },
            cancellationToken);

        return new UnpinMessageResult
        {
            MessageId = message.Id,
            Success = true
        };
    }
}