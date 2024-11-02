namespace ChatApp.Message.Features.Messages.Models;

public record FileDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public string Url { get; init; } = null!;
    public DateTime CreatedAt { get; init; }
    public string Type { get; init; } = null!;
}