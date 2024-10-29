namespace ChatApp.Message.Models;

public partial class RoomUser
{
    public int RoomId { get; set; }

    public int UserId { get; set; }

    public virtual Room Room { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
