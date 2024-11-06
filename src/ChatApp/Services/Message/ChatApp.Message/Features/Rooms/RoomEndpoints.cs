using ChatApp.Message.Features.Rooms.Queries.GetUserRooms;

namespace ChatApp.Message.Features.Rooms;

public class RoomEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var roomGroup = app.MapGroup("/api/rooms")
            .RequireAuthorization()
            .WithTags("Rooms");

        roomGroup.MapGet("/", GetUserRooms)
            .WithName("GetUserRooms")
            .WithDescription("Get all rooms that user is member of")
            .WithSummary("Get User Rooms");
    }

    private static async Task<IResult> GetUserRooms(
        ISender sender,
        CancellationToken cancellationToken)
    {
        var query = new GetUserRoomsQuery();
        var result = await sender.Send(query, cancellationToken);
        return Results.Ok(result);
    }
}