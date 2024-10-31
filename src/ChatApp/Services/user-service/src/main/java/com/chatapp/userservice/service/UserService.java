package com.chatapp.userservice.service;

import com.chatapp.userservice.dto.user.request.UserProfileRequest;
import com.chatapp.userservice.dto.user.response.UserProfileResponse;
import com.chatapp.userservice.entity.User;

public interface UserService {
    UserProfileResponse getUserProfile(int id);

    UserProfileResponse updateUserProfile(int id, UserProfileRequest request);

}
