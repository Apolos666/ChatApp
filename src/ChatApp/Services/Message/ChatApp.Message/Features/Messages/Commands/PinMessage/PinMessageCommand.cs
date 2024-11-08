namespace ChatApp.Message.Features.Messages.Commands.PinMessage;

public record PinMessageCommand : IRequest<PinMessageResult>
{
    private PinMessageCommand(int messageId)
    {
        MessageId = messageId;
    }

    public static PinMessageCommand FromRequest(int messageId)
    {
        return new PinMessageCommand(messageId);
    }

    public int MessageId { get; init; }
}