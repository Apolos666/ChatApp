namespace ChatApp.Message.Features.VideoCall.Commands.JoinVideoRoom;

public record JoinVideoRoomResponse
{
    public bool IsSuccess { get; init; }
    public string? ErrorMessage { get; init; }
}