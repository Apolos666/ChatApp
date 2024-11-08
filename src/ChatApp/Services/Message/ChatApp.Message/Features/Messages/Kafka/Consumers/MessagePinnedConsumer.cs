using ChatApp.Message.Features.Messages.Kafka;

namespace Features.Messages.Kafka.Consumers;

public class MessagePinnedConsumer(
    IServiceScopeFactory scopeFactory,
    IOptions<KafkaOptions> options,
    IHubContext<ChatHub, IChatClient> hubContext,
    ILogger<MessagePinnedConsumer> logger)
    : BaseKafkaConsumer(scopeFactory, options, hubContext, logger, options.Value.MessagePinnedTopic)
{
    protected override async Task ProcessMessageAsync(
        ConsumeResult<string, string> consumeResult,
        CancellationToken stoppingToken)
    {
        var pinStatus = JsonSerializer.Deserialize<MessagePinnedDto>(consumeResult.Message.Value);
        if (pinStatus == null) return;

        await HubContext.Clients.Group(pinStatus.RoomId.ToString())
            .MessagePinStatusChanged(pinStatus);

        Logger.LogInformation(
            "Message {MessageId} {Status} in room {RoomId} by user {SenderId}. Content: {Content}",
            pinStatus.Id,
            pinStatus.IsPinned ? "pinned" : "unpinned",
            pinStatus.RoomId,
            pinStatus.SenderId,
            pinStatus.Content);
    }
}