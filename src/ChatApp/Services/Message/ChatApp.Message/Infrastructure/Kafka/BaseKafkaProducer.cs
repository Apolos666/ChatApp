using ChatApp.Message.Features.Messages.Kafka.Interfaces;

namespace ChatApp.Message.Features.Messages.Kafka;

public abstract class BaseKafkaProducer<T> : IKafkaProducer<T>, IDisposable where T : class
{
    private readonly IProducer<string, string> _producer;
    private readonly ILogger _logger;
    private bool _disposed;

    protected BaseKafkaProducer(
        IOptions<KafkaOptions> options,
        ILogger logger)
    {
        _logger = logger;
        var config = new ProducerConfig
        {
            BootstrapServers = options.Value.BootstrapServers,
            AllowAutoCreateTopics = options.Value.AllowAutoCreateTopics
        };

        _producer = new ProducerBuilder<string, string>(config).Build();
    }

    public async Task ProduceAsync(string topic, T message, CancellationToken cancellationToken = default)
    {
        var value = JsonSerializer.Serialize(message);
        var key = GetMessageKey(message);

        var kafkaMessage = new Message<string, string>
        {
            Key = key,
            Value = value,
            Timestamp = new Timestamp(DateTime.UtcNow)
        };

        var deliveryResult = await _producer.ProduceAsync(topic, kafkaMessage, cancellationToken);
        LogDeliveryResult(message, deliveryResult);
    }

    protected abstract string GetMessageKey(T message);
    protected abstract void LogDeliveryResult(T message, DeliveryResult<string, string> result);

    public void Dispose()
    {
        if (!_disposed)
        {
            _producer?.Dispose();
            _disposed = true;
        }
        GC.SuppressFinalize(this);
    }
}