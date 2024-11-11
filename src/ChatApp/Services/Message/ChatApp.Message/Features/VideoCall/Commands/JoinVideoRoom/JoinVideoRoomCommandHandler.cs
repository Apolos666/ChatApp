namespace ChatApp.Message.Features.VideoCall.Commands.JoinVideoRoom;

public class JoinVideoRoomCommandHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor)
    :
        IRequestHandler<JoinVideoRoomCommand, JoinVideoRoomResponse>
{
    public async Task<JoinVideoRoomResponse> Handle(
        JoinVideoRoomCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser()
                          ?? throw new UnauthorizedAccessException();

        var hasAccess = await context.RoomUsers
            .AnyAsync(ru =>
                    ru.RoomId == request.RoomId &&
                    ru.UserId == currentUser.Id,
                cancellationToken);

        if (!hasAccess)
        {
            return new JoinVideoRoomResponse
            {
                IsSuccess = false,
                ErrorMessage = "Bạn không có quyền tham gia phòng này"
            };
        }

        return new JoinVideoRoomResponse { IsSuccess = true };
    }
}