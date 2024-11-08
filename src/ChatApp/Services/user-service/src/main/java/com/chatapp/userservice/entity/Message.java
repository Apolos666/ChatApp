package com.chatapp.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CurrentTimestamp;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    String content;

    @Column(name = "pinned_at", columnDefinition = "TIMESTAMP", nullable = false)
    Timestamp pinnedAt;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    @CurrentTimestamp
    Timestamp createdAt;

    @ManyToOne()
    @JoinColumn(name = "room_id")
    Room room;

    @ManyToOne()
    @JoinColumn(name = "sender_id")
    User user;

    @OneToMany(mappedBy = "message", fetch = FetchType.LAZY)
    List<File> files = new ArrayList<>();
}
