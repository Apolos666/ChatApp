namespace ChatApp.Message.Features.Messages.Commands.PinMessage;

public record PinMessageResponse
{
    public int MessageId { get; init; }
    public DateTime? PinnedAt { get; init; }
}