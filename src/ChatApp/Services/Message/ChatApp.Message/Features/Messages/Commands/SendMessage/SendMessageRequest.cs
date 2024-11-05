namespace ChatApp.Message.Features.Messages.Contracts.Requests;

public record SendMessageRequest
{
    public string? Content { get; init; }
    public int RoomId { get; init; }
    public IFormFileCollection? Files { get; init; }
}