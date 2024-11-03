namespace ChatApp.Message.Features.Messages.Contracts.Requests;

public record GetMessagesRequest
{
    public int RoomId { get; init; }
    public int PageSize { get; init; } = 20;
    public int? LastMessageId { get; init; }
}