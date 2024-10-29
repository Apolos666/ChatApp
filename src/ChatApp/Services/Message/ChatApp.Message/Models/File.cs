namespace ChatApp.Message.Models;

public sealed partial class File
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Url { get; set; } = null!;

    public int OwnerId { get; set; }

    public int RoomId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public User Owner { get; set; } = null!;

    public Room Room { get; set; } = null!;
}
