namespace ChatApp.Message.Features.Messages.Dtos;

public record TypingIndicatorDto(
    int UserId,
    string UserName,
    int RoomId,
    bool IsTyping,
    string ConnectionId,
    DateTime Timestamp);