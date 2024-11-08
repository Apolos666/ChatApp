namespace ChatApp.Message.Features.Messages.Commands.UnpinMessage;

public record UnpinMessageResult
{
    public int MessageId { get; init; }
    public bool Success { get; init; }
    public string? ErrorMessage { get; init; }
}