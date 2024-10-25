package com.chatapp.userservice.exception;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
    Timestamp time;
    Object message;
    String details;
}
