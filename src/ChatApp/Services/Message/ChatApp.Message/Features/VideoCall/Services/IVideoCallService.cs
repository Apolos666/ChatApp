namespace ChatApp.Message.Features.Messages.Services;

public interface IVideoCallService
{
    Task<VideoCallParticipant?> GetParticipant(int roomId, int userId);
    Task<IEnumerable<VideoCallParticipant>> GetParticipants(int roomId);
    Task AddParticipant(int roomId, VideoCallParticipant participant);
    Task RemoveParticipant(int roomId, int userId);
    Task<bool> HasActiveCall(int roomId);
    Task EndCall(int roomId);
}