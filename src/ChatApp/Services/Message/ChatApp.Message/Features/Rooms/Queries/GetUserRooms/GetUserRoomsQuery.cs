using MessageStatusEnum = ChatApp.Message.Features.Messages.Enums.MessageStatus;

namespace ChatApp.Message.Features.Rooms.Queries.GetUserRooms;

public record GetUserRoomsQuery : IRequest<List<RoomDto>>;

public class GetUserRoomsQueryHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<GetUserRoomsQuery, List<RoomDto>>
{
    public async Task<List<RoomDto>> Handle(
        GetUserRoomsQuery request,
        CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser()
                          ?? throw new UnauthorizedAccessException();

        var rooms = await context.RoomUsers
            .Where(ru => ru.UserId == currentUser.Id)
            .Select(ru => new RoomDto
            {
                Id = ru.Room.Id,
                Name = ru.Room.Name,
                CreatedAt = ru.Room.CreatedAt,
                UpdatedAt = ru.Room.UpdatedAt,
                LastMessage = ru.Room.Messages
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => new MessageDto
                    {
                        Content = m.Content,
                        SenderName = m.Sender.Name,
                        CreatedAt = m.CreatedAt
                    })
                    .FirstOrDefault()
            })
            .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
            .ToListAsync(cancellationToken);
        
        return rooms;
    }
}