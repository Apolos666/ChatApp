namespace ChatApp.Message.Features.Messages.Commands.UnpinMessage;

public record UnpinMessageRequest
{
    public int MessageId { get; init; }
}