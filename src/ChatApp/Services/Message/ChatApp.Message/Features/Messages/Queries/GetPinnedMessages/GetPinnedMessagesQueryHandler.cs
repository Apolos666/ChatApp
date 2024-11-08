using ChatApp.Message.Features.Messages.Queries.GetPinnedMessages;

namespace Features.Messages.Queries.GetPinnedMessages;

public class GetPinnedMessagesQueryHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<GetPinnedMessagesQuery, GetPinnedMessagesResponse>
{
    public async Task<GetPinnedMessagesResponse> Handle(
        GetPinnedMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser()
                          ?? throw new UnauthorizedAccessException();

        var isUserInRoom = await context.RoomUsers
            .AnyAsync(ru => ru.RoomId == request.RoomId && ru.UserId == currentUser.Id,
                cancellationToken);

        if (!isUserInRoom)
        {
            throw new ValidationException("User is not a member of this room");
        }

        var pinnedMessages = await context.Messages
            .Where(m => m.RoomId == request.RoomId)
            .Where(m => m.PinnedAt != null)
            .Include(m => m.Files)
            .Include(m => m.Sender)
            .OrderByDescending(m => m.PinnedAt)
            .Select(m => new MessagePinnedDto
            {
                Id = m.Id,
                Content = m.Content,
                PinnedAt = m.PinnedAt,
                RoomId = m.RoomId!.Value,
                SenderId = m.SenderId!.Value,
                SenderName = m.Sender!.Name,
                IsPinned = true,
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

        return new GetPinnedMessagesResponse
        {
            Messages = pinnedMessages
        };
    }
}