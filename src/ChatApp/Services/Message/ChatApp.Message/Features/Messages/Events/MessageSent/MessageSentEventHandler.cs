using MessageStatusModel = ChatApp.Message.Models.MessageStatus;
using MessageStatusEnum = ChatApp.Message.Features.Messages.Enums.MessageStatus;

namespace ChatApp.Message.Features.Messages.Events.MessageSent;

public class MessageSentEventHandler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<ChatHub, IChatClient> _hubContext;
    private readonly ILogger<MessageSentEventHandler> _logger;
    private readonly string _topic;
    private readonly IConsumer<string, string> _consumer;

    public MessageSentEventHandler(
        IServiceScopeFactory scopeFactory,
        IOptions<KafkaOptions> options,
        IHubContext<ChatHub, IChatClient> hubContext,
        ILogger<MessageSentEventHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
        _logger = logger;
        _topic = options.Value.MessageTopic;

        var config = new ConsumerConfig
        {
            BootstrapServers = options.Value.BootstrapServers,
            GroupId = options.Value.GroupId,
            AutoOffsetReset = AutoOffsetReset.Earliest,
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
            var topicExists = metadata.Topics.Any(t => t.Topic == options.MessageTopic);

            if (!topicExists)
            {
                var topicSpec = new TopicSpecification
                {
                    Name = options.MessageTopic,
                    ReplicationFactor = 1,
                    NumPartitions = 1
                };

                await adminClient.CreateTopicsAsync(new[] { topicSpec });
                _logger.LogInformation("Topic {Topic} created successfully", options.MessageTopic);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to ensure topic exists: {Topic}", options.MessageTopic);
            throw;
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Yield();
        try
        {
            _consumer.Subscribe(_topic);
            _logger.LogInformation("Started consuming messages from topic: {Topic}", _topic);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = _consumer.Consume(stoppingToken);
                    if (consumeResult == null) continue;

                    var message = JsonSerializer.Deserialize<MessageDto>(consumeResult.Message.Value);
                    if (message == null) continue;

                    using var scope = _scopeFactory.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var existingMessage = await dbContext.MessageStatuses.FirstOrDefaultAsync(ms =>
                        ms.MessageId == message.Id && ms.UserId == message.SenderId, stoppingToken);

                    if (existingMessage == null) throw new NotFoundException("Message not found");

                    existingMessage.Status = MessageStatusEnum.Sent.ToString();
                    await dbContext.SaveChangesAsync(stoppingToken);
                    
                    await _hubContext.Clients.Group(message.RoomId.ToString())
                        .ReceiveMessage(message);

                    _logger.LogInformation("Processed message: {MessageId}", message.Id);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message");
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fatal error in message consumer");
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
}