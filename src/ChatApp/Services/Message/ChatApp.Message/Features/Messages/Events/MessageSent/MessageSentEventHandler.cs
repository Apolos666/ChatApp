using MessageStatusEnum = ChatApp.Message.Features.Messages.Enums.MessageStatus;
using MessageStatusModel = ChatApp.Message.Models.MessageStatus;

namespace ChatApp.Message.Features.Messages.Events;

public class MessageSentEventHandler : BackgroundService
{
    private readonly IConsumer<string, string> _consumer;
    private readonly IHubContext<ChatHub, IChatClient> _hubContext;
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<MessageSentEventHandler> _logger;
    private readonly string _topic;

    public MessageSentEventHandler(
        IOptions<KafkaOptions> options,
        IHubContext<ChatHub, IChatClient> hubContext,
        ApplicationDbContext dbContext,
        ILogger<MessageSentEventHandler> logger)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = options.Value.BootstrapServers,
            GroupId = options.Value.GroupId,
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        _consumer = new ConsumerBuilder<string, string>(config).Build();
        _hubContext = hubContext;
        _dbContext = dbContext;
        _logger = logger;
        _topic = options.Value.MessageTopic;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _consumer.Subscribe(_topic);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var result = _consumer.Consume(stoppingToken);
                var message = JsonSerializer.Deserialize<MessageDto>(result.Message.Value);

                if (message != null)
                {
                    // Cập nhật trạng thái message
                    var messageStatus = new MessageStatusModel
                    {
                        MessageId = message.Id,
                        UserId = message.SenderId,
                        Status = MessageStatusEnum.Sent.ToString()
                    };

                    _dbContext.MessageStatuses.Add(messageStatus);
                    await _dbContext.SaveChangesAsync(stoppingToken);

                    await _hubContext.Clients.Group(message.RoomId.ToString())
                        .ReceiveMessage(message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error consuming message");
            }
        }
    }

    public override void Dispose()
    {
        _consumer.Dispose();
        base.Dispose();
    }
}