namespace ChatApp.Message.Features.Messages.Kafka.Producers;

public class MessageProducer(
    IOptions<KafkaOptions> options,
    ILogger<MessageProducer> logger)
    : BaseKafkaProducer<MessageDto>(options, logger)
{
    protected override string GetMessageKey(MessageDto message)
        => message.RoomId.ToString();

    protected override void LogDeliveryResult(MessageDto message, DeliveryResult<string, string> result)
    {
        logger.LogInformation(
            "Message {MessageId} delivered to topic {Topic} [{Partition}] at offset {Offset}",
            message.Id,
            result.Topic,
            result.Partition,
            result.Offset);
    }
}