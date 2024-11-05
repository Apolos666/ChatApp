namespace Features.Messages.Infrastructure
{
    public sealed class TypingIndicatorProducer : ITypingIndicatorProducer, IDisposable
    {
        private readonly IProducer<string, string> _producer;
        private readonly ILogger<TypingIndicatorProducer> _logger;
        private bool _disposed;

        public TypingIndicatorProducer(
            IOptions<KafkaOptions> options,
            ILogger<TypingIndicatorProducer> logger)
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
            TypingIndicatorDto typing,
            CancellationToken cancellationToken = default)
        {
            var value = JsonSerializer.Serialize(typing);
            var kafkaMessage = new Message<string, string>
            {
                Key = typing.RoomId.ToString(),
                Value = value,
                Timestamp = new Timestamp(DateTime.UtcNow)
            };

            await _producer.ProduceAsync(topic, kafkaMessage, cancellationToken);
        }

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
}