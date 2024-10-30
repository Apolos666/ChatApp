using MessageStatusEnum = ChatApp.Message.Features.Messages.Enums.MessageStatus;
using MessageStatusModel = ChatApp.Message.Models.MessageStatus;

namespace ChatApp.Message.Features.Messages.Commands;

public record SendMessageCommand : IRequest<MessageResponse>
{
    public required string Content { get; init; }
    public required int RoomId { get; init; }
}

public class SendMessageCommandHandler(
    ApplicationDbContext context,
    IMessageProducer producer,
    IHttpContextAccessor httpContextAccessor,
    IOptions<KafkaOptions> kafkaOptions)
    : IRequestHandler<SendMessageCommand, MessageResponse>
{
    public async Task<MessageResponse> Handle(
        SendMessageCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser();
        if (currentUser == null)
            throw new UnauthorizedAccessException();

        var isUserInRoom = await context.RoomUsers
            .AnyAsync(ru => ru.RoomId == request.RoomId &&
                           ru.UserId == currentUser.Id,
                     cancellationToken);

        if (!isUserInRoom)
        {
            throw new ValidationException("User is not a member of this room");
        }

        var message = new Message.Models.Message
        {
            Content = request.Content,
            RoomId = request.RoomId,
            SenderId = currentUser.Id,
            CreatedAt = DateTime.UtcNow.ToLocalTime()
        };

        context.Messages.Add(message);
        await context.SaveChangesAsync(cancellationToken);

        var messageStatus = new MessageStatusModel
        {
            MessageId = message.Id,
            UserId = currentUser.Id,
            Status = MessageStatusEnum.Sending.ToString()
        };

        context.MessageStatuses.Add(messageStatus);
        await context.SaveChangesAsync(cancellationToken);

        var messageDto = new MessageDto
        {
            Id = message.Id,
            Content = message.Content,
            RoomId = message.RoomId!.Value,
            SenderId = message.SenderId!.Value,
            CreatedAt = message.CreatedAt,
            Status = MessageStatusEnum.Sending.ToString()
        };

        await producer.ProduceAsync(kafkaOptions.Value.MessageTopic, messageDto, cancellationToken);

        return new MessageResponse(messageDto);
    }
}