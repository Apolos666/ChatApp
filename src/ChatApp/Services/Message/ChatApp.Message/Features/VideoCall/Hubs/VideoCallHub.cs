namespace ChatApp.Message.Features.Messages.Hubs;

[Authorize]
public class VideoCallHub(
    ILogger<VideoCallHub> logger,
    ApplicationDbContext dbContext,
    IVideoCallService videoCallService)
    : Hub<IVideoCallClient>
{
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser();
        if (currentUser != null)
        {
            // Tìm phòng mà user đang tham gia video call
            var participants = await dbContext.RoomUsers
                .Where(ru => ru.UserId == currentUser.Id)
                .Select(ru => ru.RoomId)
                .ToListAsync();

            foreach (var roomId in participants)
            {
                var participant = await videoCallService.GetParticipant(roomId, currentUser.Id);
                if (participant != null)
                {
                    await videoCallService.RemoveParticipant(roomId, currentUser.Id);
                    await Clients.Group(roomId.ToString()).OnParticipantLeft(currentUser.Id);
                }
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinRoom(int roomId)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        var isUserInRoom = await dbContext.RoomUsers
            .AnyAsync(ru => ru.RoomId == roomId && ru.UserId == currentUser.Id);

        if (!isUserInRoom)
        {
            throw new ValidationException("User is not in this room");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId.ToString());

        await Clients.Group(roomId.ToString())
            .UserJoined(new UserConnectionDto(
                currentUser.Id,
                currentUser.Name,
                roomId,
                DateTime.UtcNow));
    }

    public async Task RequestVideoCall(VideoCallRequestDto request)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        var hasActiveCall = await videoCallService.HasActiveCall(request.RoomId);
        if (hasActiveCall)
        {
            throw new ValidationException("There is already an active call in this room");
        }

        await videoCallService.AddParticipant(request.RoomId, new VideoCallParticipant
        {
            UserId = currentUser.Id,
            ConnectionId = Context.ConnectionId,
            JoinedAt = DateTime.UtcNow
        });

        await Clients.Group(request.RoomId.ToString())
            .OnVideoCallRequested(new VideoCallRequestDto
            {
                RoomId = request.RoomId,
                CallerId = currentUser.Id,
                CallerName = currentUser.Name
            });

        logger.LogInformation(
            "User {UserId} started video call in room {RoomId}",
            currentUser.Id,
            request.RoomId);
    }

    public async Task AcceptVideoCall(int roomId)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        var hasActiveCall = await videoCallService.HasActiveCall(roomId);
        if (!hasActiveCall)
        {
            throw new ValidationException("No active call found in this room");
        }

        await videoCallService.AddParticipant(roomId, new VideoCallParticipant
        {
            UserId = currentUser.Id,
            ConnectionId = Context.ConnectionId,
            JoinedAt = DateTime.UtcNow
        });

        await Clients.Group(roomId.ToString())
            .OnVideoCallAccepted(new VideoCallResponseDto
            {
                UserId = currentUser.Id,
                UserName = currentUser.Name,
                Accepted = true
            });

        logger.LogInformation(
            "User {UserId} accepted video call in room {RoomId}",
            currentUser.Id,
            roomId);
    }

    public async Task RejectVideoCall(int roomId)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        await Clients.Group(roomId.ToString())
            .OnVideoCallRejected(new VideoCallResponseDto
            {
                UserId = currentUser.Id,
                UserName = currentUser.Name,
                Accepted = false
            });

        logger.LogInformation(
            "User {UserId} rejected video call in room {RoomId}",
            currentUser.Id,
            roomId);
    }

    public async Task EndVideoCall(int roomId)
    {
        await videoCallService.EndCall(roomId);
        await Clients.Group(roomId.ToString()).OnVideoCallEnded(roomId);

        logger.LogInformation("Video call ended in room {RoomId}", roomId);
    }

    public async Task SendIceCandidate(int roomId, int receiverId, RTCIceCandidateInit candidate)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        var receiver = await videoCallService.GetParticipant(roomId, receiverId);
        if (receiver != null)
        {
            await Clients.Client(receiver.ConnectionId)
                .OnIceCandidate(currentUser.Id, candidate);
        }
    }

    public async Task SendOffer(int roomId, int receiverId, RTCSessionDescriptionInit offer)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        var receiver = await videoCallService.GetParticipant(roomId, receiverId);
        if (receiver != null)
        {
            await Clients.Client(receiver.ConnectionId)
                .OnOffer(currentUser.Id, offer);
        }
    }

    public async Task SendAnswer(int roomId, int receiverId, RTCSessionDescriptionInit answer)
    {
        var currentUser = Context.GetHttpContext()?.GetCurrentUser()
            ?? throw new UnauthorizedException();

        var receiver = await videoCallService.GetParticipant(roomId, receiverId);
        if (receiver != null)
        {
            await Clients.Client(receiver.ConnectionId)
                .OnAnswer(currentUser.Id, answer);
        }
    }
}