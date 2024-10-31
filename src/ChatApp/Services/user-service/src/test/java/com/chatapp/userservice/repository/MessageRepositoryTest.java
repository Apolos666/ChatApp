package com.chatapp.userservice.repository;


import com.chatapp.userservice.entity.Message;
import com.chatapp.userservice.entity.MessageStatus;
import com.chatapp.userservice.entity.Room;
import com.chatapp.userservice.entity.User;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.sql.Timestamp;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class MessageRepositoryTest {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageStatusRepository messageStatusRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void createMessage() {
        Integer userId = 1;
        Integer roomId = 3;

        Room room = roomRepository.findById(roomId).get();
        User user = userRepository.findById(userId).get();

        Message message = new Message();
        message.setContent("message 2222");
        message.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        message.setPinnedAt(new Timestamp(System.currentTimeMillis()));
        message.setRoom(room);
        message.setUser(user);

        Message savedMessage = messageRepository.save(message);

        Assertions.assertThat(savedMessage).isNotNull();

    }
}
