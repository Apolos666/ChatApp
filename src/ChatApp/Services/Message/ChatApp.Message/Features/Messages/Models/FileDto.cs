namespace ChatApp.Message.Features.Messages.Models;

public record FileDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public string Url { get; init; } = null!;
    public string PublicId { get; init; } = null!;
    public string Type { get; init; } = null!;
    public long Size { get; init; }
    public DateTime CreatedAt { get; init; }
}