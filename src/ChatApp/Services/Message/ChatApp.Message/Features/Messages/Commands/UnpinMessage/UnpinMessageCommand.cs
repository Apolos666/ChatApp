namespace ChatApp.Message.Features.Messages.Commands.UnpinMessage;

public record UnpinMessageCommand : IRequest<UnpinMessageResult>
{
    private UnpinMessageCommand(int messageId)
    {
        MessageId = messageId;
    }

    public static UnpinMessageCommand FromRequest(int messageId)
    {
        return new UnpinMessageCommand(messageId);
    }

    public int MessageId { get; init; }
}