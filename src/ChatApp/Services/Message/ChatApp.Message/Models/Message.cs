using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public sealed partial class Message
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? PinnedAt { get; set; }

    public int? RoomId { get; set; }

    public int? SenderId { get; set; }

    public ICollection<File> Files { get; set; } = new List<File>();

    public ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

    public Room? Room { get; set; }

    public User? Sender { get; set; }
}
