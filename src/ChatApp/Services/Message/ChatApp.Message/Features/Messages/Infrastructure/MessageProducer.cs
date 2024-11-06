namespace ChatApp.Message.Features.Messages.Infrastructure;

public sealed class MessageProducer : IMessageProducer, IDisposable
{
    private readonly IProducer<string, string> _producer;
    private readonly ILogger<MessageProducer> _logger;
    private bool _disposed;

    public MessageProducer(
        IOptions<KafkaOptions> options,
        ILogger<MessageProducer> logger)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = options.Value.BootstrapServers,
            AllowAutoCreateTopics = options.Value.AllowAutoCreateTopics
        };

        _producer = new ProducerBuilder<string, string>(config).Build();
        _logger = logger;
    }

    public async Task ProduceAsync(
        string topic,
        MessageDto message,
        CancellationToken cancellationToken = default)
    {
        var value = JsonSerializer.Serialize(message);
        var kafkaMessage = new Message<string, string>
        {
            Key = message.RoomId.ToString(),
            Value = value,
            Timestamp = new Timestamp(DateTime.UtcNow)
        };

        var deliveryResult = await _producer.ProduceAsync(
            topic,
            kafkaMessage,
            cancellationToken);

        _logger.LogInformation(
            "Message {MessageId} delivered to topic {Topic} [{Partition}] at offset {Offset}",
            message.Id,
            deliveryResult.Topic,
            deliveryResult.Partition,
            deliveryResult.Offset);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    private void Dispose(bool disposing)
    {
        if (_disposed)
            return;

        if (disposing)
        {
            _producer.Dispose();
        }

        _disposed = true;
    }
}