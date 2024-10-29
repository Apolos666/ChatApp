using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public partial class MessageStatus
{
    public string? Status { get; set; }

    public int MessageId { get; set; }

    public int UserId { get; set; }

    public virtual Message Message { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
