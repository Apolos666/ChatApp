namespace ChatApp.Message.Features.Messages.Models;

public record MessageStatusUpdateDto
{
    public int MessageId { get; init; }
    public string Status { get; init; } = null!;
    public string? Error { get; init; }
}