namespace ChatApp.Message.Features.Messages.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(MessageDto message);
    Task UserJoined(UserConnectionDto connection);
    Task UserLeft(UserConnectionDto connection);
    Task MessageStatusUpdated(MessageStatusUpdateDto statusUpdate);
    Task TypingIndicatorReceived(TypingIndicatorDto typing);
}

public record UserConnectionDto(
    int UserId,
    string UserName,
    int RoomId,
    DateTime Timestamp);