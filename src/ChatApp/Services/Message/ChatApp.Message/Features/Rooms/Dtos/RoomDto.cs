namespace ChatApp.Message.Features.Rooms.Dtos;

public record RoomDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public MessageDto? LastMessage { get; init; }
    public int MemberCount { get; init; }
    public ICollection<FileDto> Files { get; init; } = [];
}