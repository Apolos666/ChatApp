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
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "name", columnDefinition = "VARCHAR(255)", nullable = false)
    String name;

    @Column(name = "url", columnDefinition = "VARCHAR(255)", nullable = false)
    String url;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    Timestamp createdAt;

    @ManyToOne()
    @JoinColumn(name = "owner_id")
    User user;

    @ManyToOne()
    @JoinColumn(name = "room_id")
    Room room;
}
