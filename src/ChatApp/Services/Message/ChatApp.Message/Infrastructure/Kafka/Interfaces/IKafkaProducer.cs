namespace ChatApp.Message.Features.Messages.Kafka.Interfaces;

public interface IKafkaProducer<in T> where T : class
{
    Task ProduceAsync(string topic, T message, CancellationToken cancellationToken = default);
}