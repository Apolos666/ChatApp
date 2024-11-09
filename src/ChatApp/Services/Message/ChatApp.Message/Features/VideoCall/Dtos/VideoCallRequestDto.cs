namespace ChatApp.Message.Features.Messages.Dtos.VideoCall;

public class VideoCallRequestDto
{
    public int RoomId { get; set; }
    public int CallerId { get; set; }
    public string CallerName { get; set; }
}