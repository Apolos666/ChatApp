package com.chatapp.userservice.service;

import com.chatapp.userservice.dto.MessageStatusDto;

public interface MessageService {

    MessageStatusDto deleteMessage(int messageId);
}
