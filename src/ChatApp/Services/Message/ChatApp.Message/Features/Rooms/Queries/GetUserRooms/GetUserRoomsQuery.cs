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
        
        var userRoomIds = await context.RoomUsers
            .Where(ru => ru.UserId == currentUser.Id)
            .Select(ru => ru.RoomId)
            .ToListAsync(cancellationToken);


        var rooms = await context.Rooms
            .Where(r => userRoomIds.Contains(r.Id))
            .Select(r => new RoomDto
            {
                Id = r.Id,
                Name = r.Name,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt,
                MemberCount = context.RoomUsers.Count(ru => ru.RoomId == r.Id),
                Files = r.Files.Select(f => new FileDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Url = f.Url,
                    CreatedAt = f.CreatedAt,
                    Type = f.Name.GetMimeType()
                }).ToList(),
                LastMessage = r.Messages
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => new MessageDto
                    {
                        Content = m.Content,
                        SenderName = m.Sender.Name,
                        CreatedAt = m.CreatedAt,
                        SenderId = m.SenderId,
                    })
                    .FirstOrDefault()
            })
            .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
            .AsSplitQuery()
            .ToListAsync(cancellationToken);

        return rooms;
    }
}