package com.chatapp.userservice.entity;

import com.chatapp.userservice.entity.keys.MessageStatusId;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "message_status")
public class MessageStatus {
    @EmbeddedId
    MessageStatusId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne
    @MapsId("messageId")
    @JoinColumn(name = "message_id")
    Message message;

    @Column(name = "status", columnDefinition = "VARCHAR(255)")
    String status;
}
