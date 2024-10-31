package com.chatapp.userservice.service.impl;

import com.chatapp.userservice.dto.message.MessageStatusDto;
import com.chatapp.userservice.entity.Message;
import com.chatapp.userservice.entity.MessageStatus;
import com.chatapp.userservice.enums.MessageStatusEnum;
import com.chatapp.userservice.repository.MessageRepository;
import com.chatapp.userservice.repository.MessageStatusRepository;
import com.chatapp.userservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageStatusRepository messageStatusRepository;
    private final MessageRepository messageRepository;

    @Override
    public MessageStatusDto deleteMessage(int messageId) {

        Message message = messageRepository.findById(messageId)
                                .orElseThrow(() -> new RuntimeException("Message not found with ID: "+messageId));

        messageStatusRepository.updateMessageStatus(message.getId(), MessageStatusEnum.DELETED.toString());

        MessageStatus messageStatus = messageStatusRepository.findByMessageId(messageId);

        return convertToDTO(messageStatus);
    }


    private MessageStatusDto convertToDTO(MessageStatus entity) {
        return new MessageStatusDto(entity.getId().getMessageId(), entity.getStatus());
    }
}
