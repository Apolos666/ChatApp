namespace ChatApp.Message.Features.VideoCall;

public class VideoCallEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var videoCallGroup = app.MapGroup("/api/video-call")
            .RequireAuthorization()
            .WithTags("VideoCall");

        videoCallGroup.MapPost("/join/{roomId:int}", JoinVideoRoom)
            .WithName("JoinVideoRoom")
            .WithDescription("Kiểm tra quyền và tham gia phòng video call");
    }

    private static async Task<IResult> JoinVideoRoom(
        int roomId,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new JoinVideoRoomCommand(roomId);
        var result = await sender.Send(command, cancellationToken);

        if (!result.IsSuccess)
        {
            return Results.BadRequest(new { error = result.ErrorMessage });
        }

        return Results.Ok(result);
    }
}