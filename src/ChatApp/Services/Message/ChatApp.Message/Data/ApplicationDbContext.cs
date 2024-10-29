using Microsoft.EntityFrameworkCore;
using File = ChatApp.Message.Models.File;

namespace ChatApp.Message.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public virtual DbSet<File> Files { get; init; }
    public virtual DbSet<Models.Message> Messages { get; init; }
    public virtual DbSet<MessageStatus> MessageStatuses { get; init; }
    public virtual DbSet<RefreshToken> RefreshTokens { get; init; }
    public virtual DbSet<Role> Roles { get; init; }
    public virtual DbSet<Room> Rooms { get; init; }
    public virtual DbSet<User> Users { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
