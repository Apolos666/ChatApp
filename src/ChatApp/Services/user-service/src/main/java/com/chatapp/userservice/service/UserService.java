package com.chatapp.userservice.service;

import com.chatapp.userservice.dto.user.request.UserProfileRequest;
import com.chatapp.userservice.dto.user.response.UserProfileResponse;
import com.chatapp.userservice.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserProfileResponse getUserProfile(int id);

    UserProfileResponse updateUserProfile(int id, UserProfileRequest request);

    String updateUserAvatar(int id, MultipartFile file);

    String deleteUserAvatar(int id);
}
