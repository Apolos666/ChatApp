package com.chatapp.userservice.service;

import com.chatapp.userservice.entity.User;

public interface UserService {
    User findByEmail(String email);
}
