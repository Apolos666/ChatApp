using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public sealed partial class File
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Name { get; set; } = null!;

    public string Url { get; set; } = null!;

    public int? MessageId { get; set; }

    public int? RoomId { get; set; }

    public int? OwnerId { get; set; }

    public Message? Message { get; set; }

    public User? Owner { get; set; }

    public Room? Room { get; set; }
}
