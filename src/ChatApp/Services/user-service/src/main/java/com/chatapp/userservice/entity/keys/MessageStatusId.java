package com.chatapp.userservice.entity.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageStatusId {
    @Column(name = "message_id")
    int messageId;

    @Column(name = "user_id")
    int userId;
}
