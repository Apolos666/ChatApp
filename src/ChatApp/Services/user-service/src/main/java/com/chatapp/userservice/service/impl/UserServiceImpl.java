package com.chatapp.userservice.service.impl;

import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.exception.ApiException;
import com.chatapp.userservice.repository.UserRepository;
import com.chatapp.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found with given email: "+email, HttpStatus.BAD_REQUEST));
    }
}
