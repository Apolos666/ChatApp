namespace ChatApp.Message.Infrastructure.SignalR;

public interface IBaseClient
{
    Task UserJoined(UserConnectionDto connection);
    Task UserLeft(UserConnectionDto connection);
}