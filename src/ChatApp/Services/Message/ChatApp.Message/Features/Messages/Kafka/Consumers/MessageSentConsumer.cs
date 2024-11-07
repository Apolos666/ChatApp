using MessageStatusEnum = ChatApp.Message.Features.Messages.Enums.MessageStatus;

using ChatApp.Message.Features.Messages.Kafka;

namespace Web.Services.Kafka.Consumers;

public class MessageSentConsumer(
    IServiceScopeFactory scopeFactory,
    IOptions<KafkaOptions> options,
    IHubContext<ChatHub, IChatClient> hubContext,
    ILogger<MessageSentConsumer> logger)
    : BaseKafkaConsumer(scopeFactory, options, hubContext, logger, options.Value.MessageTopic)
{
    protected override async Task ProcessMessageAsync(
        ConsumeResult<string, string> consumeResult,
        CancellationToken stoppingToken)
    {
        var message = JsonSerializer.Deserialize<MessageDto>(consumeResult.Message.Value);
        if (message == null) return;

        using var scope = ScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var existingMessage = await dbContext.MessageStatuses.FirstOrDefaultAsync(ms =>
            ms.MessageId == message.Id && ms.UserId == message.SenderId, stoppingToken);

        if (existingMessage == null)
        {
            await NotifyMessageStatus(message.Id, message.RoomId, "Failed", "Message not found");
            return;
        }

        try
        {
            existingMessage.Status = MessageStatusEnum.Sent.ToString();
            await dbContext.SaveChangesAsync(stoppingToken);

            await HubContext.Clients.Group(message.RoomId.ToString())
                .ReceiveMessage(message);

            await NotifyMessageStatus(message.Id, message.RoomId, MessageStatusEnum.Sent.ToString(), null);

            Logger.LogInformation("Processed message: {MessageId}", message.Id);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error processing message {MessageId}", message.Id);
            await NotifyMessageStatus(message.Id, message.RoomId, MessageStatusEnum.Failed.ToString(), ex.Message);
        }
    }

    private async Task NotifyMessageStatus(int messageId, int roomId, string status, string? error)
    {
        var statusUpdate = new MessageStatusUpdateDto
        {
            MessageId = messageId,
            Status = status,
            Error = error
        };

        await HubContext.Clients.Group(roomId.ToString())
            .MessageStatusUpdated(statusUpdate);
    }
}