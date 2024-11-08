namespace ChatApp.Message.Features.Messages.Commands.SendMessage;

public record SendMessageResult
{
    public int MessageId { get; init; }
    public bool Success { get; init; }
    public string? ErrorMessage { get; init; }
}