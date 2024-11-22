using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public partial class File
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Name { get; set; } = null!;

    public string Url { get; set; } = null!;

    public int? MessageId { get; set; }

    public int? RoomId { get; set; }

    public int? OwnerId { get; set; }

    public virtual Message? Message { get; set; }

    public virtual User? Owner { get; set; }

    public virtual Room? Room { get; set; }
}
