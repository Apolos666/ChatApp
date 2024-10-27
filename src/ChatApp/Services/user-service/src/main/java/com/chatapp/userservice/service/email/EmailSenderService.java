package com.chatapp.userservice.service.email;

import com.chatapp.userservice.dto.kafka.EmailMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final KafkaTemplate<String, EmailMessage> kafkaTemplate;

    public void sendEmail(String to, String subject, String template, Map<String, Object> attributes) {
        EmailMessage emailMessage = new EmailMessage(to, subject, template, attributes);
        kafkaTemplate.send("email-topic", emailMessage);
    }
}
