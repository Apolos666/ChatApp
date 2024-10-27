package com.chatapp.userservice.config;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import java.util.Properties;

@Configuration
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailConfig {

    @Value("${spring.mail.host}")
    String host;

    @Value("${spring.mail.username}")
    String username;

    @Value("${spring.mail.password}")
    String password;

    @Value("${spring.mail.port}")
    int port;

    @Value("${spring.mail.protocol}")
    String protocol;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    String auth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    String enable;

    @Value("${spring.mail.debug}")
    String debug;

    @Bean
    public JavaMailSender javaMailSender(){
        JavaMailSenderImpl javaMailSender =new JavaMailSenderImpl();
        javaMailSender.setUsername(username);
        javaMailSender.setPassword(password);
        javaMailSender.setPort(port);
        javaMailSender.setHost(host);

        Properties properties=javaMailSender.getJavaMailProperties();
        properties.setProperty("mail.debug",debug);
        properties.setProperty("mail.transport.protocol",protocol);
        properties.setProperty("mail.smtp.auth",auth);
        properties.setProperty("mail.smtp.starttls.enable",enable);
        properties.setProperty("mail.smtp.ssl.trust","*");

        return javaMailSender;
    }

    @Bean
    public ITemplateResolver templateResolver(){
        ClassLoaderTemplateResolver templateResolver=new ClassLoaderTemplateResolver();
        templateResolver.setPrefix("templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode("HTML");
        templateResolver.setCharacterEncoding("UTF-8");
        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine springTemplateEngine(){
        SpringTemplateEngine templateEngine=new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());
        return templateEngine;
    }
}
