using File = ChatApp.Message.Models.File;
using MessageStatusEnum = ChatApp.Message.Features.Messages.Enums.MessageStatus;
using MessageStatusModel = ChatApp.Message.Models.MessageStatus;

namespace ChatApp.Message.Features.Messages.Commands;

public record SendMessageCommand : IRequest<SendMessageResponse>
{
    public required string? Content { get; init; }
    public required int RoomId { get; init; }
    public IFormFileCollection? Files { get; init; }
}

public class SendMessageCommandHandler(
    ApplicationDbContext context,
    IMessageProducer producer,
    IHttpContextAccessor httpContextAccessor,
    IOptions<KafkaOptions> kafkaOptions,
    ICloudinaryService cloudinaryService)
    : IRequestHandler<SendMessageCommand, SendMessageResponse>
{
    public async Task<SendMessageResponse> Handle(
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
            throw new ValidationException("User is not a member of this room");

        var message = new Message.Models.Message
        {
            Content = request.Content,
            RoomId = request.RoomId,
            SenderId = currentUser.Id,
            CreatedAt = DateTime.UtcNow.ToLocalTime()
        };

        context.Messages.Add(message);
        await context.SaveChangesAsync(cancellationToken);

        var files = new List<File>();
        if (request.Files != null && request.Files.Any())
        {
            foreach (var file in request.Files)
            {
                var (url, publicId) = await cloudinaryService.UploadAsync(
                    file,
                    $"messages/{message.Id}",
                    cancellationToken);

                var messageFile = new File
                {
                    MessageId = message.Id,
                    Name = file.FileName,
                    Url = url,
                    OwnerId = currentUser.Id,
                    CreatedAt = DateTime.UtcNow.ToLocalTime(),
                    RoomId = request.RoomId
                };

                files.Add(messageFile);
            }

            context.Files.AddRange(files);
            await context.SaveChangesAsync(cancellationToken);
        }

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
            SenderName = currentUser.Name,
            CreatedAt = message.CreatedAt,
            Status = MessageStatusEnum.Sending.ToString(),
            Files = files.Select(f => new FileDto
            {
                Id = f.Id,
                Name = f.Name,
                Url = f.Url,
                CreatedAt = f.CreatedAt
            }).ToList()
        };

        await producer.ProduceAsync(
            kafkaOptions.Value.MessageTopic,
            messageDto,
            cancellationToken);

        return new SendMessageResponse(message.Id);
    }
}