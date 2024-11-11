namespace ChatApp.Message.Features.VideoCall.Hubs;

[Authorize]
public class VideoCallHub(ILogger<VideoCallHub> logger, ISender sender, ApplicationDbContext dbContext) : Hub
{
    public override async Task OnConnectedAsync()
    {
        logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation(
            "Client disconnected: {ConnectionId}. Reason: {Exception}",
            Context.ConnectionId,
            exception?.Message ?? "Normal disconnect"
        );
        await Clients.All.SendAsync("userDisconnected", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinRoom(string roomId)
    {
        var currentUser = Context.GetHttpContext().GetCurrentUser()
            ?? throw new HubException("Không thể xác thực người dùng");

        var hasAccess = await dbContext.RoomUsers
            .AnyAsync(ru =>
                ru.RoomId == int.Parse(roomId) &&
                ru.UserId == currentUser.Id);

        if (!hasAccess)
        {
            throw new HubException("Bạn không có quyền tham gia phòng này");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        logger.LogInformation(
            "User {ConnectionId} joined room: {RoomId}",
            Context.ConnectionId,
            roomId
        );

        await Clients.GroupExcept(roomId, Context.ConnectionId)
            .SendAsync("userConnected", Context.ConnectionId);
    }

    public async Task SendSignal(string signal, string roomId, string userId)
    {
        logger.LogInformation(
            "Signal from {FromId} to {ToId} in room {RoomId}. Signal type: {SignalType}",
            Context.ConnectionId,
            userId,
            roomId,
            signal.Contains("\"type\":\"offer\"") ? "offer" :
            signal.Contains("\"type\":\"answer\"") ? "answer" :
            signal.Contains("\"type\":\"candidate\"") ? "candidate" : "unknown"
        );
        await Clients.Client(userId).SendAsync("receiveSignal", signal, Context.ConnectionId);
    }
}