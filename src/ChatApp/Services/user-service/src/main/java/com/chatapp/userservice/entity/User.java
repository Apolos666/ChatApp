package com.chatapp.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CurrentTimestamp;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "name", columnDefinition = "VARCHAR(255)", nullable = false)
    String name;

    @Column(name = "phone_number", columnDefinition = "VARCHAR(255)", nullable = false)
    String phoneNumber;

    @Column(name = "dob", columnDefinition = "DATE", nullable = false)
    Date dob;

    @Column(name = "address", columnDefinition = "VARCHAR(255)")
    String address;

    @Column(name = "email", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    String email;

    @Column(name = "password", columnDefinition = "VARCHAR(255)", nullable = false)
    String password;

    @Column(name = "activation_code", columnDefinition = "VARCHAR(255)")
    String activationCode;

    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT FALSE", nullable = false)
    boolean isActive;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    @CurrentTimestamp
    Timestamp createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    @LastModifiedDate
    Timestamp updatedAt;

    @ManyToOne()
    @JoinColumn(name = "role_id")
    Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    List<Room> rooms = new ArrayList<>();

    @PreRemove
    private void preRemove(){
        rooms.forEach(room -> room.setUser(null));
    }

    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
    List<Room> joinedRooms = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    List<File> files = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    List<RefreshToken> refreshTokens = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    List<Message> messages = new ArrayList<>();
}
