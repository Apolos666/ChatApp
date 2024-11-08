namespace ChatApp.Message.Features.Messages.Kafka.Producers;

public class MessagePinProducer(
    IOptions<KafkaOptions> options,
    ILogger<MessagePinProducer> logger)
    : BaseKafkaProducer<MessagePinnedDto>(options, logger)
{
    protected override string GetMessageKey(MessagePinnedDto message)
        => message.RoomId.ToString();

    protected override void LogDeliveryResult(MessagePinnedDto message, DeliveryResult<string, string> result)
    {
        logger.LogInformation(
            "Pin status for message {MessageId} delivered to topic {Topic} [{Partition}] at offset {Offset}",
            message.Id,
            result.Topic,
            result.Partition,
            result.Offset);
    }
}