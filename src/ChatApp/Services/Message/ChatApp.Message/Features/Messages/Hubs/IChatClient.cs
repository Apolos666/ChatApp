namespace ChatApp.Message.Features.Messages.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(MessageDto message);
    Task UserJoined(UserConnectionDto connection);
    Task UserLeft(UserConnectionDto connection);
}

public record UserConnectionDto(
    int UserId,
    string UserName,
    int RoomId,
    DateTime Timestamp);