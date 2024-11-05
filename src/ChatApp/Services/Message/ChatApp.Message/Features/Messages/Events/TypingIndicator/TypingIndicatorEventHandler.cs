namespace ChatApp.Message.Features.Messages.Events.TypingIndicator;

public class TypingIndicatorEventHandler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<ChatHub, IChatClient> _hubContext;
    private readonly ILogger<TypingIndicatorEventHandler> _logger;
    private readonly string _topic;
    private readonly IConsumer<string, string> _consumer;

    public TypingIndicatorEventHandler(
        IServiceScopeFactory scopeFactory,
        IOptions<KafkaOptions> options,
        IHubContext<ChatHub, IChatClient> hubContext,
        ILogger<TypingIndicatorEventHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
        _logger = logger;
        _topic = options.Value.TypingTopic;

        var config = new ConsumerConfig
        {
            BootstrapServers = options.Value.BootstrapServers,
            GroupId = options.Value.GroupId,
            AutoOffsetReset = AutoOffsetReset.Latest,
            EnableAutoCommit = true
        };

        _consumer = new ConsumerBuilder<string, string>(config).Build();

        EnsureTopicExists(options.Value).GetAwaiter().GetResult();
    }

    private async Task EnsureTopicExists(KafkaOptions options)
    {
        try
        {
            using var adminClient = new AdminClientBuilder(new AdminClientConfig
            {
                BootstrapServers = options.BootstrapServers
            }).Build();

            var metadata = adminClient.GetMetadata(TimeSpan.FromSeconds(10));
            var topicExists = metadata.Topics.Any(t => t.Topic == options.TypingTopic);

            if (!topicExists)
            {
                var topicSpec = new TopicSpecification
                {
                    Name = options.TypingTopic,
                    ReplicationFactor = 1,
                    NumPartitions = 1
                };

                await adminClient.CreateTopicsAsync([topicSpec]);
                _logger.LogInformation("Topic {Topic} created successfully", options.TypingTopic);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to ensure topic exists: {Topic}", options.TypingTopic);
            throw;
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Yield();
        try
        {
            _consumer.Subscribe(_topic);
            _logger.LogInformation("Started consuming typing indicators from topic: {Topic}", _topic);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = _consumer.Consume(stoppingToken);
                    if (consumeResult == null) continue;

                    var typing = JsonSerializer.Deserialize<TypingIndicatorDto>(consumeResult.Message.Value);
                    if (typing == null) continue;

                    using var scope = _scopeFactory.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    // Kiểm tra user có trong room không
                    var isUserInRoom = await dbContext.RoomUsers
                        .AnyAsync(ru => ru.RoomId == typing.RoomId && ru.UserId == typing.UserId,
                            stoppingToken);

                    if (!isUserInRoom)
                    {
                        _logger.LogWarning(
                            "User {UserId} is not in room {RoomId}",
                            typing.UserId,
                            typing.RoomId);
                        continue;
                    }

                    try
                    {
                        // Gửi đến tất cả người trong room trừ người gửi
                        await _hubContext.Clients
                            .GroupExcept(typing.RoomId.ToString(), [typing.ConnectionId])
                            .TypingIndicatorReceived(typing);

                        _logger.LogInformation(
                            "Processed typing indicator from user {UserId} in room {RoomId}",
                            typing.UserId,
                            typing.RoomId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex,
                            "Error processing typing indicator from user {UserId} in room {RoomId}",
                            typing.UserId,
                            typing.RoomId);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing typing indicator");
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fatal error in typing indicator consumer");
            throw;
        }
        finally
        {
            try
            {
                _consumer.Close();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error closing consumer");
            }
        }
    }

    public override void Dispose()
    {
        _consumer.Dispose();
        base.Dispose();
    }
}