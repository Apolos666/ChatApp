using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public partial class RefreshToken
{
    public int Id { get; set; }

    public DateTime ExpiresAt { get; set; }

    public string Token { get; set; } = null!;

    public int? UserId { get; set; }

    public virtual User? User { get; set; }
}
