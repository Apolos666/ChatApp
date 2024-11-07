namespace ChatApp.Message.Features.Messages.Dtos;

public record MessagePinnedDto(int MessageId, int RoomId, bool IsPinned);