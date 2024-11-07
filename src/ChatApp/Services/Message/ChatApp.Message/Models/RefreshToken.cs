using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public sealed partial class RefreshToken
{
    public int Id { get; set; }

    public DateTime ExpiresAt { get; set; }

    public string Token { get; set; } = null!;

    public int? UserId { get; set; }

    public User? User { get; set; }
}
