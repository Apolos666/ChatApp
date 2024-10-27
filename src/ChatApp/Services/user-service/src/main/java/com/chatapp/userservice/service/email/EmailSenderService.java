package com.chatapp.userservice.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailSenderService {
    private final SpringTemplateEngine springTemplateEngine;

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    String username;

    public void sendEmail(String to, String subject, String template, Map<String, Object> attributes) {
        try {
            Context context = new Context();
            context.setVariables(attributes);
            String htmlBody = springTemplateEngine.process(template, context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setFrom(username);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(htmlBody, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
