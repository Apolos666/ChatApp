using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public sealed partial class Role
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public ICollection<User> Users { get; set; } = new List<User>();
}
