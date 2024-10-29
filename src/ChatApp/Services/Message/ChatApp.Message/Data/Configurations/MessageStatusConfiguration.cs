using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChatApp.Message.Data.Configurations;

public class MessageStatusConfiguration : IEntityTypeConfiguration<MessageStatus>
{
    public void Configure(EntityTypeBuilder<MessageStatus> entity)
    {
        entity.HasKey(e => new { e.UserId, e.MessageId }).HasName("message_status_pkey");

        entity.ToTable("message_status");

        entity.Property(e => e.UserId).HasColumnName("user_id");
        entity.Property(e => e.MessageId).HasColumnName("message_id");
        entity.Property(e => e.Status)
            .HasMaxLength(255)
            .HasColumnName("status");

        entity.HasOne(d => d.Message).WithMany(p => p.MessageStatuses)
            .HasForeignKey(d => d.MessageId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_message_id");

        entity.HasOne(d => d.User).WithMany(p => p.MessageStatuses)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_user_id");
    }
}