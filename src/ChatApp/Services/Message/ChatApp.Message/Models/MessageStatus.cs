using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public sealed partial class MessageStatus
{
    public string? Status { get; set; }

    public int MessageId { get; set; }

    public int UserId { get; set; }

    public Message Message { get; set; } = null!;

    public User User { get; set; } = null!;
}
