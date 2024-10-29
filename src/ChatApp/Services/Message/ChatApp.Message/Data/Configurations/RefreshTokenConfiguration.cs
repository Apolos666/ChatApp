using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChatApp.Message.Data.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> entity)
    {
        entity.HasKey(e => e.Id).HasName("refresh_tokens_pkey");

        entity.ToTable("refresh_tokens");

        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.ExpiresAt)
            .HasColumnType("timestamp without time zone")
            .HasColumnName("expires_at");
        entity.Property(e => e.Token)
            .HasMaxLength(255)
            .HasColumnName("token");
        entity.Property(e => e.UserId).HasColumnName("user_id");

        entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("fk_user_id");
    }
}