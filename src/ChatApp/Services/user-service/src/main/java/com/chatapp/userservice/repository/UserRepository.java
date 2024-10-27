package com.chatapp.userservice.repository;

import com.chatapp.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query(value = "SELECT * FROM users WHERE email=:email AND is_active=true", nativeQuery = true)
    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE email=:email AND activation_code=:activationCode AND is_active=false", nativeQuery = true)
    Optional<User> findByEmailAndActivationCode(String email, String activationCode);

    @Query(value = "SELECT * FROM users WHERE email=:email AND is_active=false", nativeQuery = true)
    User findByEmailWithoutActivation(String email);

    boolean existsByEmail(String email);
}
