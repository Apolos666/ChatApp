using System;
using System.Collections.Generic;

namespace ChatApp.Message.Models;

public partial class User
{
    public int Id { get; set; }

    public string? ActivationCode { get; set; }

    public string? Address { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateOnly Dob { get; set; }

    public string Email { get; set; } = null!;

    public bool IsActive { get; set; }

    public string Name { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public int? RoleId { get; set; }

    public virtual ICollection<File> Files { get; set; } = new List<File>();

    public virtual ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual Role? Role { get; set; }

    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
