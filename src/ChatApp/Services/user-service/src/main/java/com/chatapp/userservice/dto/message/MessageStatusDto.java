package com.chatapp.userservice.dto.message;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageStatusDto {
    private int messageId;
    private String status;
}
