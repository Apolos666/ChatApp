namespace ChatApp.Message.Features.Messages.Queries.GetPinnedMessages;

public record GetPinnedMessagesQuery : IRequest<GetPinnedMessagesResponse>
{
    private GetPinnedMessagesQuery(GetPinnedMessagesRequest request)
    {
        RoomId = request.RoomId;
    }

    public static GetPinnedMessagesQuery FromRequest(GetPinnedMessagesRequest request)
    {
        return new GetPinnedMessagesQuery(request);
    }

    public int RoomId { get; init; }
}