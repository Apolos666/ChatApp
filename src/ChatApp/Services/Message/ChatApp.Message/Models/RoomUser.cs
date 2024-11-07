using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public sealed partial class RoomUser
{
    public int RoomId { get; set; }

    public int UserId { get; set; }

    public Room Room { get; set; } = null!;

    public User User { get; set; } = null!;
}
