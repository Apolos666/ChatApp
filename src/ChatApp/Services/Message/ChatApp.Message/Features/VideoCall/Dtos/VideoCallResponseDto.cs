namespace ChatApp.Message.Features.Messages.Dtos.VideoCall;

public class VideoCallResponseDto
{
    public int UserId { get; set; }
    public string UserName { get; set; }
    public bool Accepted { get; set; }
}