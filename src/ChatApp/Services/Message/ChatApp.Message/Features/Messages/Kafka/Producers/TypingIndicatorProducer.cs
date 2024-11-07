namespace ChatApp.Message.Features.Messages.Kafka.Producers;

public class TypingIndicatorProducer(
    IOptions<KafkaOptions> options,
    ILogger<TypingIndicatorProducer> logger)
    : BaseKafkaProducer<TypingIndicatorDto>(options, logger)
{
    protected override string GetMessageKey(TypingIndicatorDto message)
        => message.RoomId.ToString();

    protected override void LogDeliveryResult(TypingIndicatorDto message, DeliveryResult<string, string> result)
    {
        logger.LogInformation(
            "Typing indicator from user {UserId} in room {RoomId} delivered to topic {Topic} [{Partition}] at offset {Offset}",
            message.UserId,
            message.RoomId,
            result.Topic,
            result.Partition,
            result.Offset);
    }
}