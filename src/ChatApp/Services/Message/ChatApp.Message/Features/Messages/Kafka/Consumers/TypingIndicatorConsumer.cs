namespace ChatApp.Message.Features.Messages.Kafka.Consumers;

public class TypingIndicatorConsumer(
    IServiceScopeFactory scopeFactory,
    IOptions<KafkaOptions> options,
    IHubContext<ChatHub, IChatClient> hubContext,
    ILogger<TypingIndicatorConsumer> logger)
    : BaseKafkaConsumer(scopeFactory, options, hubContext, logger, options.Value.TypingTopic)
{
    protected override async Task ProcessMessageAsync(
        ConsumeResult<string, string> consumeResult,
        CancellationToken stoppingToken)
    {
        var typing = JsonSerializer.Deserialize<TypingIndicatorDto>(consumeResult.Message.Value);
        if (typing == null) return;

        using var scope = ScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var isUserInRoom = await dbContext.RoomUsers
            .AnyAsync(ru => ru.RoomId == typing.RoomId && ru.UserId == typing.UserId,
                stoppingToken);

        if (!isUserInRoom)
        {
            Logger.LogWarning(
                "User {UserId} is not in room {RoomId}",
                typing.UserId,
                typing.RoomId);
            return;
        }

        try
        {
            await HubContext.Clients
                .GroupExcept(typing.RoomId.ToString(), [typing.ConnectionId])
                .TypingIndicatorReceived(typing);

            Logger.LogInformation(
                "Processed typing indicator from user {UserId} in room {RoomId}",
                typing.UserId,
                typing.RoomId);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex,
                "Error processing typing indicator from user {UserId} in room {RoomId}",
                typing.UserId,
                typing.RoomId);
            throw;
        }
    }
}