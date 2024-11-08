namespace ChatApp.Message.Features.Messages.Commands.PinMessage;

public record PinMessageRequest
{
    public int MessageId { get; init; }
}