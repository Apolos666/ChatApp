package com.chatapp.userservice.service.impl;

import com.chatapp.userservice.entity.RefreshToken;
import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.exception.ApiException;
import com.chatapp.userservice.repository.RefreshTokenRepository;
import com.chatapp.userservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshTokenService {

    @Value("${yml.refresh-tokenExpiration-time}")
    long refreshTokenExpirationTime;

    final UserRepository userRepository;

    final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken generateRefreshToken(int userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ApiException("User not found with given id: "+userId, HttpStatus.BAD_REQUEST)
        );

        RefreshToken refreshToken = refreshTokenRepository.findByUserOrderById(userId);

        if(refreshToken == null){
            refreshToken = new RefreshToken();
            refreshToken.setUser(user);
        }

        Timestamp currentDate = new Timestamp(System.currentTimeMillis());

        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(new Timestamp(currentDate.getTime()+refreshTokenExpirationTime*7));

        refreshTokenRepository.save(refreshToken);

        return refreshToken;
    }

    public boolean validateRefreshToken(RefreshToken refreshToken){
        if(refreshToken.getExpiresAt().after(new Timestamp(System.currentTimeMillis()))){
            return true;
        }
        return false;
    }

}
