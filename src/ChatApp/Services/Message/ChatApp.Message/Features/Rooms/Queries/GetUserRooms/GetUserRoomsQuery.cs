namespace ChatApp.Message.Features.Rooms.Queries.GetUserRooms;

public record GetUserRoomsQuery : IRequest<List<RoomDto>>;