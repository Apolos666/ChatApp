namespace ChatApp.Message.Features.Messages.Commands.PinMessage;

public record PinMessageResult
{
    public int MessageId { get; init; }
    public DateTime? PinnedAt { get; init; }
    public bool Success { get; init; }
    public string? ErrorMessage { get; init; }
}