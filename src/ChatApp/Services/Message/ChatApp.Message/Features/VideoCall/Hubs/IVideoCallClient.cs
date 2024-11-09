namespace ChatApp.Message.Features.VideoCall.Hubs;

public interface IVideoCallClient : IBaseClient
{
    Task OnVideoCallRequested(VideoCallRequestDto request);
    Task OnVideoCallAccepted(VideoCallResponseDto response);
    Task OnVideoCallRejected(VideoCallResponseDto response);
    Task OnVideoCallEnded(int roomId);
    Task OnIceCandidate(int userId, RTCIceCandidateInit candidate);
    Task OnOffer(int userId, RTCSessionDescriptionInit offer);
    Task OnAnswer(int userId, RTCSessionDescriptionInit answer);
    Task OnParticipantLeft(int userId);
}