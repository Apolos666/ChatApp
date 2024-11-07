namespace ChatApp.Message.Features.Messages.Kafka;

public abstract class BaseKafkaConsumer : BackgroundService
{
    protected readonly IServiceScopeFactory ScopeFactory;
    protected readonly IHubContext<ChatHub, IChatClient> HubContext;
    protected readonly ILogger Logger;
    private readonly string Topic;
    private readonly IConsumer<string, string> Consumer;

    protected BaseKafkaConsumer(
        IServiceScopeFactory scopeFactory,
        IOptions<KafkaOptions> options,
        IHubContext<ChatHub, IChatClient> hubContext,
        ILogger logger,
        string topic)
    {
        ScopeFactory = scopeFactory;
        HubContext = hubContext;
        Logger = logger;
        Topic = topic;

        var config = new ConsumerConfig
        {
            BootstrapServers = options.Value.BootstrapServers,
            GroupId = options.Value.GroupId,
            AutoOffsetReset = AutoOffsetReset.Latest,
            EnableAutoCommit = true
        };

        Consumer = new ConsumerBuilder<string, string>(config).Build();
        EnsureTopicExists(options.Value, topic).GetAwaiter().GetResult();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Yield();
        try
        {
            Consumer.Subscribe(Topic);
            Logger.LogInformation("Started consuming from topic: {Topic}", Topic);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = Consumer.Consume(stoppingToken);
                    if (consumeResult == null) continue;

                    await ProcessMessageAsync(consumeResult, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Error processing message");
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Fatal error in consumer");
            throw;
        }
        finally
        {
            try
            {
                Consumer.Close();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error closing consumer");
            }
        }
    }

    protected abstract Task ProcessMessageAsync(ConsumeResult<string, string> consumeResult, CancellationToken stoppingToken);

    private async Task EnsureTopicExists(KafkaOptions options, string topic)
    {
        try
        {
            using var adminClient = new AdminClientBuilder(new AdminClientConfig
            {
                BootstrapServers = options.BootstrapServers
            }).Build();

            var metadata = adminClient.GetMetadata(TimeSpan.FromSeconds(10));
            var topicExists = metadata.Topics.Any(t => t.Topic == topic);

            if (!topicExists)
            {
                var topicSpec = new TopicSpecification
                {
                    Name = topic,
                    ReplicationFactor = 1,
                    NumPartitions = 1
                };

                await adminClient.CreateTopicsAsync(new[] { topicSpec });
                Logger.LogInformation("Topic {Topic} created successfully", topic);
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Failed to ensure topic exists: {Topic}", topic);
            throw;
        }
    }

    public override void Dispose()
    {
        Consumer?.Dispose();
        base.Dispose();
    }
}