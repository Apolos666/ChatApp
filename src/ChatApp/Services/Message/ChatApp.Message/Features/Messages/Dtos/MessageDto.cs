namespace ChatApp.Message.Features.Messages.Models;

public record MessageDto
{
    public int Id { get; init; }
    public string? Content { get; init; }
    public int RoomId { get; init; }
    public int? SenderId { get; init; }
    public string SenderName { get; init; } = null!;
    public DateTime CreatedAt { get; init; }
    public string Status { get; init; } = null!;
    public List<FileDto> Files { get; init; } = [];
}