namespace ChatApp.Message.Features.Messages.Commands.DeleteMessage;

public record DeleteMessageResult
{
    public int MessageId { get; init; }
    public bool Success { get; init; }
}