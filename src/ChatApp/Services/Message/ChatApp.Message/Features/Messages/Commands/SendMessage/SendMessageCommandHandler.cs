﻿using File = ChatApp.Message.Models.File;

namespace ChatApp.Message.Features.Messages.Commands;

public class SendMessageCommandHandler(
    ApplicationDbContext context,
    IKafkaProducer<MessageDto> producer,
    IHttpContextAccessor httpContextAccessor,
    IOptions<KafkaOptions> kafkaOptions,
    ICloudinaryService cloudinaryService)
    : IRequestHandler<SendMessageCommand, SendMessageResult>
{
    private readonly KafkaOptions _kafkaOptions = kafkaOptions.Value;

    public async Task<SendMessageResult> Handle(
        SendMessageCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = await ValidateAndGetCurrentUser(request.RoomId, cancellationToken);
        var message = await CreateMessage(request, currentUser, cancellationToken);
        var files = await HandleFileUploads(request, message, currentUser, cancellationToken);
        await CreateMessageStatus(message.Id, currentUser.Id, cancellationToken);
        await NotifyMessageCreated(message, files, currentUser, cancellationToken);

        return new SendMessageResult
        {
            MessageId = message.Id
        };
    }

    private async Task<CurrentUser> ValidateAndGetCurrentUser(int roomId, CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser();
        if (currentUser == null)
            throw new UnauthorizedAccessException();

        var isUserInRoom = await context.RoomUsers
            .AnyAsync(ru => ru.RoomId == roomId && ru.UserId == currentUser.Id, cancellationToken);

        if (!isUserInRoom)
            throw new ValidationException("User is not a member of this room");

        return currentUser;
    }

    private async Task<Message.Models.Message> CreateMessage(
        SendMessageCommand request,
        CurrentUser currentUser,
        CancellationToken cancellationToken)
    {
        var message = new Message.Models.Message
        {
            Content = request.Content,
            RoomId = request.RoomId,
            SenderId = currentUser.Id,
            CreatedAt = DateTime.UtcNow.ToLocalTime()
        };

        context.Messages.Add(message);
        await context.SaveChangesAsync(cancellationToken);
        return message;
    }

    private async Task<List<File>> HandleFileUploads(
        SendMessageCommand request,
        Message.Models.Message message,
        CurrentUser currentUser,
        CancellationToken cancellationToken)
    {
        var files = new List<File>();
        if (request.Files == null || !request.Files.Any())
            return files;

        foreach (var file in request.Files)
        {
            var (url, publicId) = await cloudinaryService.UploadAsync(
                file,
                $"messages/{message.Id}",
                cancellationToken);

            files.Add(new File
            {
                MessageId = message.Id,
                Name = file.FileName,
                Url = url,
                OwnerId = currentUser.Id,
                CreatedAt = DateTime.UtcNow.ToLocalTime(),
                RoomId = request.RoomId
            });
        }

        context.Files.AddRange(files);
        await context.SaveChangesAsync(cancellationToken);
        return files;
    }

    private async Task CreateMessageStatus(
        int messageId,
        int userId,
        CancellationToken cancellationToken)
    {
        var messageStatus = new MessageStatus
        {
            MessageId = messageId,
            UserId = userId,
            Status = Enums.MessageStatus.Sending.ToString()
        };

        context.MessageStatuses.Add(messageStatus);
        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task NotifyMessageCreated(
        Message.Models.Message message,
        List<File> files,
        CurrentUser currentUser,
        CancellationToken cancellationToken)
    {
        var messageDto = new MessageDto
        {
            Id = message.Id,
            Content = message.Content,
            RoomId = message.RoomId!.Value,
            SenderId = message.SenderId!.Value,
            SenderName = currentUser.Name,
            CreatedAt = message.CreatedAt,
            Status = Enums.MessageStatus.Sending.ToString(),
            Files = files.Select(f => new FileDto
            {
                Id = f.Id,
                Name = f.Name,
                Url = f.Url,
                CreatedAt = f.CreatedAt,
                Type = f.Name.GetMimeType()
            }).ToList()
        };

        await producer.ProduceAsync(
            _kafkaOptions.MessageTopic,
            messageDto,
            cancellationToken);
    }
}