namespace ChatApp.Message.Models;

public sealed partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public DateOnly Dob { get; set; }

    public string? Address { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? ActivationCode { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int RoleId { get; set; }

    public ICollection<File> Files { get; set; } = new List<File>();

    public ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

    public ICollection<Message> Messages { get; set; } = new List<Message>();

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public Role Role { get; set; } = null!;

    public ICollection<Room> Rooms { get; set; } = new List<Room>();

    public ICollection<Room> RoomsNavigation { get; set; } = new List<Room>();
}
