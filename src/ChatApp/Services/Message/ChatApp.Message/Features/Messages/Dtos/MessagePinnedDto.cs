namespace ChatApp.Message.Features.Messages.Dtos;

public record MessagePinnedDto
{
    public int Id { get; init; }
    public string Content { get; init; } = null!;
    public DateTime? PinnedAt { get; init; }
    public int RoomId { get; init; }
    public int SenderId { get; init; }
    public string SenderName { get; init; } = null!;
    public bool IsPinned { get; init; }
    public List<FileDto> Files { get; init; } = [];
}