using MessageStatusEnum = ChatApp.Message.Features.Messages.Enums.MessageStatus;

namespace Features.Messages.Queries.GetMessages;

public class GetMessagesQueryHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<GetMessagesQuery, GetMessagesResponse>
{
    public async Task<GetMessagesResponse> Handle(
        GetMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser()
                          ?? throw new UnauthorizedAccessException();

        // Kiểm tra user có trong room không
        var isUserInRoom = await context.RoomUsers
            .AnyAsync(ru => ru.RoomId == request.RoomId && ru.UserId == currentUser.Id,
                cancellationToken);

        if (!isUserInRoom)
        {
            throw new ValidationException("User is not a member of this room");
        }

        // Query tin nhắn
        var query = context.Messages
            .Where(m => m.RoomId == request.RoomId)
            .Where(m => m.MessageStatuses
                .Any(ms => ms.UserId == m.SenderId && ms.Status == MessageStatusEnum.Sent.ToString()));

        // Nếu có LastMessageId thì lấy các tin nhắn cũ hơn
        if (request.LastMessageId.HasValue)
        {
            query = query.Where(m => m.Id < request.LastMessageId.Value);
        }

        // Lấy tin nhắn + 1 để check còn tin nhắn không
        var messages = await query
            .Include(m => m.Files)
            .Include(m => m.Sender)
            .Include(m => m.MessageStatuses)
            .OrderByDescending(m => m.Id)
            .Take(request.PageSize + 1)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                RoomId = m.RoomId!.Value,
                SenderId = m.SenderId!.Value,
                SenderName = m.Sender!.Name,
                CreatedAt = m.CreatedAt,
                Status = m.MessageStatuses
                    .FirstOrDefault(ms => ms.UserId == m.SenderId)!.Status!,
                Files = m.Files.Select(f => new FileDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Url = f.Url,
                    CreatedAt = f.CreatedAt,
                    Type = f.Name.GetMimeType()
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        var hasMore = messages.Count > request.PageSize;
        if (hasMore)
        {
            messages.RemoveAt(messages.Count - 1);
        }

        return new GetMessagesResponse
        {
            Messages = messages,
            HasMore = hasMore
        };
    }
}