package com.chatapp.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "token", columnDefinition = "VARCHAR(255)", nullable = false)
    String token;

    @Column(name = "expires_at", columnDefinition = "TIMESTAMP", nullable = false)
    Timestamp expiresAt;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    User user;


}
