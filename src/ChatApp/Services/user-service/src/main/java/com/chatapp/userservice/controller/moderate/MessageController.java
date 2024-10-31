package com.chatapp.userservice.controller.moderate;

import com.chatapp.userservice.dto.message.MessageStatusDto;
import com.chatapp.userservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/management/messages")
public class MessageController {

    private final MessageService messageService;

    @PutMapping("/{messageId}")
    public ResponseEntity<MessageStatusDto> deleteMessage(
            @PathVariable("messageId") int messageId) {

        MessageStatusDto messageStatusDto = messageService.deleteMessage(messageId);

        return ResponseEntity.status(HttpStatus.OK).body(messageStatusDto);
    }
}
