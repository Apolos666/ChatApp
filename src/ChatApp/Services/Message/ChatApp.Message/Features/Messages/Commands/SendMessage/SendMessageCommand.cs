namespace ChatApp.Message.Features.Messages.Commands;

public record SendMessageCommand : IRequest<SendMessageResult>
{
    private SendMessageCommand(SendMessageRequest request)
    {
        Content = request.Content;
        RoomId = request.RoomId;
        Files = request.Files;
    }

    public static SendMessageCommand FromRequest(SendMessageRequest request)
    {
        return new SendMessageCommand(request);
    }

    public string? Content { get; init; }
    public int RoomId { get; init; }
    public IFormFileCollection? Files { get; init; }
}