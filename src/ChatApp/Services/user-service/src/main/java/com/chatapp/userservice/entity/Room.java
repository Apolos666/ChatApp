package com.chatapp.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CurrentTimestamp;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "name", columnDefinition = "VARCHAR(255)", nullable = false)
    String name;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    @CurrentTimestamp
    Timestamp createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    @LastModifiedDate
    Timestamp updatedAt;

    @ManyToOne()
    @JoinColumn(name = "creator_id")
    User user;

    @ManyToMany
    @JoinTable(
            name = "room_users",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    List<File> files = new ArrayList<>();

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    List<Message> messages = new ArrayList<>();
}
