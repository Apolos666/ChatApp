using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public sealed partial class Room
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public int? CreatorId { get; set; }

    public User? Creator { get; set; }

    public ICollection<File> Files { get; set; } = new List<File>();

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
