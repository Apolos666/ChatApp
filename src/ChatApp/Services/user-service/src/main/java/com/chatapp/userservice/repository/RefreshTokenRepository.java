package com.chatapp.userservice.repository;

import com.chatapp.userservice.entity.RefreshToken;
import com.chatapp.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

    Optional<RefreshToken> findByToken(String token);

    @Query(value = "SELECT * FROM refresh_tokens WHERE user_id=:userId ORDER BY id limit 1",nativeQuery = true)
    RefreshToken findByUserOrderById(int userId);

}
