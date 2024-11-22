namespace ChatApp.Message.Features.Messages.Commands.DeleteMessage;

public record DeleteMessageResponse
{
    public int MessageId { get; init; }
}