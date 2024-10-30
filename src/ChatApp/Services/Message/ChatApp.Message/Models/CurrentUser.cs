namespace ChatApp.Message.Models;

public class CurrentUser
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool IsActive { get; set; }
    public int? RoleId { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public string? Address { get; set; }
}