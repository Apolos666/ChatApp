namespace ChatApp.Message.Features.Messages.Commands.DeleteMessage;

public record DeleteMessageRequest
{
    public int MessageId { get; init; }
}