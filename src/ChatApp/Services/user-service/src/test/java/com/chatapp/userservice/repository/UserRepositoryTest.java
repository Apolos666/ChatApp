package com.chatapp.userservice.repository;

import com.chatapp.userservice.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Date;
import java.sql.Timestamp;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void createUser() {
        User user = new User();
        user.setName("John Doe");
        user.setPhoneNumber("1234567890");
        user.setDob(Date.valueOf("1990-01-01"));
        user.setAddress("123 Main St");
        user.setEmail("johndoe@example.com");
        user.setPassword("securepassword");
        user.setActivationCode("12345");
        user.setActive(true);
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        User savedUser = userRepository.save(user);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isGreaterThan(0);
        assertThat(savedUser.getName()).isEqualTo("John Doe");
    }

    @Test
    public void createAnotherUser() {
        User user = new User();
        user.setName("Jane Smith");
        user.setPhoneNumber("0987654321");
        user.setDob(Date.valueOf("1992-05-15"));
        user.setAddress("456 Elm St");
        user.setEmail("janesmith@example.com");
        user.setPassword("anothersecurepassword");
        user.setActivationCode("67890");
        user.setActive(false);
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        User savedUser = userRepository.save(user);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isGreaterThan(0);
        assertThat(savedUser.getName()).isEqualTo("Jane Smith");
    }


}
