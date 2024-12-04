package com.chatapp.userservice.service.impl;

import com.chatapp.userservice.dto.ObjectResponse;
import com.chatapp.userservice.dto.user.UserDto;
import com.chatapp.userservice.dto.user.request.UserProfileRequest;
import com.chatapp.userservice.dto.user.response.UserProfileResponse;
import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.exception.ApiException;
import com.chatapp.userservice.repository.UserRepository;
import com.chatapp.userservice.service.UserService;
import com.chatapp.userservice.service.storage.CloudinaryService;
import com.chatapp.userservice.utils.AppUtil;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;

    ModelMapper mapper;

    CloudinaryService cloudinaryService;

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

    @Override
    public String updateUserAvatar(int id, MultipartFile file) {

        User user = userRepository.findById(id).orElseThrow(
                () -> new ApiException("User not found with given id: "+id, HttpStatus.BAD_REQUEST)
        );

        String oldAvatar = null;

        if(user.getAvatar() != null){
            oldAvatar = user.getAvatar();
        }

        String avatarUrl = cloudinaryService.uploadFile(file);
        if (oldAvatar != null){
            cloudinaryService.deleteFile(oldAvatar);
        }

        user.setAvatar(avatarUrl);
        userRepository.save(user);

        return "Updated avatar successfully!";
    }

    @Override
    public String deleteUserAvatar(int id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ApiException("User not found with given id: "+id, HttpStatus.BAD_REQUEST)
        );

        if(user.getAvatar() == null){
            throw new ApiException("User does not have avatar!",HttpStatus.BAD_REQUEST);
        }

        if(cloudinaryService.deleteFile(user.getAvatar())){
            user.setAvatar(null);
            userRepository.save(user);
            return "Deleted avatar successfully!";
        }
        return "Deleted avatar failed!";

    }

    @Override
    public ObjectResponse searchUser(int pageSize, int pageNumber, String sortBy, String sortDir, String name) {
        Pageable pageable = AppUtil.createPageable(pageSize, pageNumber, sortDir, sortBy);
        Page<User> page = userRepository.searchUser(pageable, name);
        List<UserDto> userDtos = new ArrayList<>();

        for (User user : page.getContent()) {
            UserDto userDto = mapper.map(user, UserDto.class);
            userDtos.add(userDto);
        }

        ObjectResponse response = AppUtil.createObjectResponse(page, userDtos);
        return response;
    }

}
