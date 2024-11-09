namespace ChatApp.Message.Infrastructure.RTC;

public class VideoCallParticipant
{
    public int UserId { get; set; }
    public string ConnectionId { get; set; }
    public DateTime JoinedAt { get; set; }
}