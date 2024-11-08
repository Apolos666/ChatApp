namespace ChatApp.Message.Features.Messages.Queries.GetPinnedMessages;

public record GetPinnedMessagesRequest
{
    public int RoomId { get; init; }
}