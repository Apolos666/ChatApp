namespace Features.Messages.Queries.GetMessages;

public record GetMessagesQuery : IRequest<GetMessagesResponse>
{
    private GetMessagesQuery(GetMessagesRequest request)
    {
        RoomId = request.RoomId;
        PageSize = request.PageSize;
        LastMessageId = request.LastMessageId;
    }

    public static GetMessagesQuery FromRequest(GetMessagesRequest request)
    {
        return new GetMessagesQuery(request);
    }

    public int RoomId { get; init; }
    public int PageSize { get; init; }
    public int? LastMessageId { get; init; }
}