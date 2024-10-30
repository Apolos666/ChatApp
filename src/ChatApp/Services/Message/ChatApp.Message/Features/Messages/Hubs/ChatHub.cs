namespace ChatApp.Message.Features.Messages.Hubs;

[Authorize]
public class ChatHub(
    ILogger<ChatHub> logger,
    ApplicationDbContext dbContext)
    : Hub<IChatClient>
{
    public async Task JoinRoom(int roomId)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        var isUserInRoom = await dbContext.RoomUsers
            .AnyAsync(ru => ru.RoomId == roomId && ru.UserId == currentUser.Id);

        if (!isUserInRoom)
        {
            throw new ValidationException("User is not in this room");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId.ToString());

        logger.LogInformation(
            "User {UserId} joined room {RoomId}",
            currentUser.Id,
            roomId);

        await Clients.Group(roomId.ToString())
            .UserJoined(new UserConnectionDto(
                currentUser.Id,
                currentUser.Name,
                roomId,
                DateTime.UtcNow));
    }

    public async Task LeaveRoom(int roomId)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId.ToString());

        logger.LogInformation(
            "User {UserId} left room {RoomId}",
            currentUser.Id,
            roomId);

        await Clients.Group(roomId.ToString())
            .UserLeft(new UserConnectionDto(
                currentUser.Id,
                currentUser.Name,
                roomId,
                DateTime.UtcNow));
    }

    public override async Task OnConnectedAsync()
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser();
        if (currentUser != null)
        {
            logger.LogInformation("User {UserId} connected", currentUser.Id);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser();
        if (currentUser != null)
        {
            logger.LogInformation(
                exception,
                "User {UserId} disconnected",
                currentUser.Id);
        }
        await base.OnDisconnectedAsync(exception);
    }
}