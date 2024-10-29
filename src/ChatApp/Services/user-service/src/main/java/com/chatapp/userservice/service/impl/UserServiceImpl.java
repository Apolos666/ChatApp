package com.chatapp.userservice.service.impl;

import com.chatapp.userservice.dto.user.request.UserProfileRequest;
import com.chatapp.userservice.dto.user.response.UserProfileResponse;
import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.exception.ApiException;
import com.chatapp.userservice.repository.UserRepository;
import com.chatapp.userservice.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;

    ModelMapper mapper;

    @Override
    public UserProfileResponse getUserProfile(int id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ApiException("User not found with given id: "+id, HttpStatus.BAD_REQUEST)
        );

        UserProfileResponse response = mapper.map(user, UserProfileResponse.class);

        return response;
    }

    @Override
    public UserProfileResponse updateUserProfile(int id, UserProfileRequest request) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ApiException("User not found with given id: "+id, HttpStatus.BAD_REQUEST)
        );

        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDob(request.getDob());
        user.setAddress(request.getAddress());

        UserProfileResponse response = mapper.map(user, UserProfileResponse.class);

        return response;
    }
}
