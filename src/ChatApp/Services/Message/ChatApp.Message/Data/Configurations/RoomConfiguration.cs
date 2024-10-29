using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChatApp.Message.Data.Configurations;

public class RoomConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> entity)
    {
        entity.HasKey(e => e.Id).HasName("rooms_pkey");

        entity.ToTable("rooms");

        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("created_at");
        entity.Property(e => e.CreatorId).HasColumnName("creator_id");
        entity.Property(e => e.Name)
            .HasMaxLength(255)
            .HasColumnName("name");
        entity.Property(e => e.UpdatedAt)
            .HasColumnType("timestamp without time zone")
            .HasColumnName("updated_at");

        entity.HasOne(d => d.Creator).WithMany(p => p.Rooms)
            .HasForeignKey(d => d.CreatorId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_creator_id");

        entity.HasMany(d => d.Users).WithMany(p => p.RoomsNavigation)
            .UsingEntity<Dictionary<string, object>>(
                "RoomUser",
                r => r.HasOne<User>().WithMany()
                    .HasForeignKey("UserId")
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_user_id"),
                l => l.HasOne<Room>().WithMany()
                    .HasForeignKey("RoomId")
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_room_id"),
                j =>
                {
                    j.HasKey("RoomId", "UserId").HasName("room_users_pkey");
                    j.ToTable("room_users");
                    j.IndexerProperty<int>("RoomId").HasColumnName("room_id");
                    j.IndexerProperty<int>("UserId").HasColumnName("user_id");
                });
    }
}