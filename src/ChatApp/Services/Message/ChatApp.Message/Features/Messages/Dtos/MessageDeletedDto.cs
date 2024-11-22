public record MessageDeletedDto
{
    public int MessageId { get; init; }
    public int RoomId { get; init; }
    public int DeletedBy { get; init; }
    public DateTime DeletedAt { get; init; }
}