namespace ChatApp.Message.Features.Messages.Dtos.VideoCall;

public class VideoCallSignalingDto
{
    public int RoomId { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public RTCSessionDescriptionInit SessionDescription { get; set; }
    public RTCIceCandidateInit IceCandidate { get; set; }
}