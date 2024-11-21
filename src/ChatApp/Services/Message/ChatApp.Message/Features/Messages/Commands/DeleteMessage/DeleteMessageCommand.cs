namespace ChatApp.Message.Features.Messages.Commands.DeleteMessage;

public record DeleteMessageCommand(int MessageId) : IRequest<DeleteMessageResult>
{
    public static DeleteMessageCommand FromRequest(DeleteMessageRequest request)
        => new(request.MessageId);
}