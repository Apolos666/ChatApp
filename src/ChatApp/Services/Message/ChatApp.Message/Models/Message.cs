using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public partial class Message
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime PinnedAt { get; set; }

    public int? RoomId { get; set; }

    public int? SenderId { get; set; }

    public virtual ICollection<File> Files { get; set; } = new List<File>();

    public virtual ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

    public virtual Room? Room { get; set; }

    public virtual User? Sender { get; set; }
}
