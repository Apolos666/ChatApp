using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChatApp.Message.Data.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Models.Message>
{
    public void Configure(EntityTypeBuilder<Models.Message> entity)
    {
        entity.HasKey(e => e.Id).HasName("messages_pkey");

        entity.ToTable("messages");

        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.Content).HasColumnName("content");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("created_at");
        entity.Property(e => e.PinnedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("pinned_at");
        entity.Property(e => e.RoomId).HasColumnName("room_id");
        entity.Property(e => e.SenderId).HasColumnName("sender_id");

        entity.HasOne(d => d.Room).WithMany(p => p.Messages)
            .HasForeignKey(d => d.RoomId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_room_id");

        entity.HasOne(d => d.Sender).WithMany(p => p.Messages)
            .HasForeignKey(d => d.SenderId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_sender_id");
    }
}