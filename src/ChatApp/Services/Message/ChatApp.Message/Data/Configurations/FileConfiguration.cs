using Microsoft.EntityFrameworkCore.Metadata.Builders;
using File = ChatApp.Message.Models.File;

namespace ChatApp.Message.Data.Configurations;

public class FileConfiguration : IEntityTypeConfiguration<File>
{
    public void Configure(EntityTypeBuilder<File> entity)
    {
        entity.HasKey(e => e.Id).HasName("files_pkey");

        entity.ToTable("files");

        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("created_at");
        entity.Property(e => e.Name)
            .HasMaxLength(255)
            .HasColumnName("name");
        entity.Property(e => e.OwnerId).HasColumnName("owner_id");
        entity.Property(e => e.RoomId).HasColumnName("room_id");
        entity.Property(e => e.Url)
            .HasMaxLength(255)
            .HasColumnName("url");

        entity.HasOne(d => d.Owner).WithMany(p => p.Files)
            .HasForeignKey(d => d.OwnerId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_owner_id");

        entity.HasOne(d => d.Room).WithMany(p => p.Files)
            .HasForeignKey(d => d.RoomId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_room_id");
    }
}