namespace ChatApp.Message.Features.Messages.Commands.UnpinMessage;

public record UnpinMessageResponse
{
    public int MessageId { get; init; }
}