namespace ChatApp.Message.Models;

public abstract partial class Message
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public int SenderId { get; set; }

    public int RoomId { get; set; }

    public DateTime? PinnedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

    public virtual Room Room { get; set; } = null!;

    public virtual User Sender { get; set; } = null!;
}
