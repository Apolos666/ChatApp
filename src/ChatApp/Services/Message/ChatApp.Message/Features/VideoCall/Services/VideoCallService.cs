namespace ChatApp.Message.Features.Messages.Services;

public class VideoCallService(IMemoryCache cache) : IVideoCallService
{
    private const string CACHE_KEY_PREFIX = "videocall_";
    private static readonly TimeSpan CACHE_DURATION = TimeSpan.FromHours(1);

    private static string GetRoomKey(int roomId) => $"{CACHE_KEY_PREFIX}{roomId}";

    public async Task<VideoCallParticipant?> GetParticipant(int roomId, int userId)
    {
        var participants = await GetParticipants(roomId);
        return participants.FirstOrDefault(p => p.UserId == userId);
    }

    public Task<IEnumerable<VideoCallParticipant>> GetParticipants(int roomId)
    {
        var key = GetRoomKey(roomId);
        var participants = cache.Get<HashSet<VideoCallParticipant>>(key) ?? [];
        return Task.FromResult(participants.AsEnumerable());
    }

    public Task AddParticipant(int roomId, VideoCallParticipant participant)
    {
        var key = GetRoomKey(roomId);
        var participants = cache.Get<HashSet<VideoCallParticipant>>(key) ?? [];

        participants.Add(participant);
        cache.Set(key, participants, CACHE_DURATION);

        return Task.CompletedTask;
    }

    public async Task RemoveParticipant(int roomId, int userId)
    {
        var key = GetRoomKey(roomId);
        var participants = cache.Get<HashSet<VideoCallParticipant>>(key);

        if (participants != null)
        {
            participants.RemoveWhere(p => p.UserId == userId);
            if (participants.Count != 0)
            {
                cache.Set(key, participants, CACHE_DURATION);
            }
            else
            {
                await EndCall(roomId);
            }
        }
    }

    public Task<bool> HasActiveCall(int roomId)
    {
        var key = GetRoomKey(roomId);
        var participants = cache.Get<HashSet<VideoCallParticipant>>(key);
        return Task.FromResult(participants != null && participants.Count != 0);
    }

    public Task EndCall(int roomId)
    {
        var key = GetRoomKey(roomId);
        cache.Remove(key);
        return Task.CompletedTask;
    }
}