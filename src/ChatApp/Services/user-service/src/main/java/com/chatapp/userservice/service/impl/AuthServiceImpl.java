package com.chatapp.userservice.service.impl;

import com.chatapp.userservice.dto.auth.request.*;
import com.chatapp.userservice.dto.auth.response.LoginResponse;
import com.chatapp.userservice.dto.auth.response.RefreshTokenResponse;
import com.chatapp.userservice.entity.RefreshToken;
import com.chatapp.userservice.entity.Role;
import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.enums.UserRoleEnum;
import com.chatapp.userservice.exception.ApiException;
import com.chatapp.userservice.repository.RefreshTokenRepository;
import com.chatapp.userservice.repository.RoleRepository;
import com.chatapp.userservice.repository.UserRepository;
import com.chatapp.userservice.security.CustomizedUserDetails;
import com.chatapp.userservice.security.JwtProvider;
import com.chatapp.userservice.service.AuthService;
import com.chatapp.userservice.service.email.EmailSenderService;
import com.chatapp.userservice.utils.AppUtil;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
//@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {

    UserRepository userRepository;

    AuthenticationManager authenticationManager;

    JwtProvider jwtProvider;

    PasswordEncoder passwordEncoder;

    RefreshTokenService refreshTokenService;

    EmailSenderService emailSenderService;

    ModelMapper mapper;

    RoleRepository roleRepository;

    RefreshTokenRepository refreshTokenRepository;


    @Transactional
    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);

        CustomizedUserDetails userDetails = (CustomizedUserDetails) authentication.getPrincipal();

        String token = jwtProvider.generateToken(userDetails);

        String refreshToken = refreshTokenService.generateRefreshToken(userDetails.getId()).getToken();

        return LoginResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .build();
    }

    @Transactional
    @Override
    public String changePassword(int id, PasswordModifyRequest request) {

        User user = userRepository.findById(id).orElseThrow(
                () -> new ApiException("User not found with given id: "+id, HttpStatus.BAD_REQUEST)
        );

        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())){
            throw new ApiException("Password is not correct!",HttpStatus.UNAUTHORIZED);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return "Change password successfully!";
    }

    @Override
    public String registerAccount(RegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())){
            throw new ApiException("Email has been used", HttpStatus.BAD_REQUEST);
        }

        // There are two cases:
        // 1. Account is already existing but not activated.
        // 2. Account is not existing in db.
        User user = userRepository.findByEmailWithoutActivation(request.getEmail());

        if(user != null){
            userRepository.deleteById(user.getId());
            System.out.println("Here");
        }

        user = new User();
        user = mapper.map(request, User.class);
//        user.setActivationCode(UUID.randomUUID().toString());
        user.setActivationCode(AppUtil.generateRandomPassword(8));
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role role = roleRepository.findById(UserRoleEnum.NORMAL_USER.getRoleId()).get();

        user.setRole(role);

        userRepository.save(user);

        Map<String, Object> emailTemplateAttributes = new HashMap<>();
        emailTemplateAttributes.put("name",user.getName());
        emailTemplateAttributes.put("activationCode",user.getActivationCode());

        sendEmail(user.getEmail(),"Activation email", "activation-email", emailTemplateAttributes);

        return "Registration successful, please confirm via email!";
    }

    @Transactional
    @Override
    public String activateAccount(ActivationAccountRequest request) {

        User user = userRepository.findByEmailAndActivationCode(request.getEmail(), request.getActivationCode()).orElseThrow(
                () -> new ApiException("Wrong email or activation code", HttpStatus.BAD_REQUEST)
        );

        user.setActive(true);
        userRepository.save(user);

        return "Account activation successful!";
    }

    @Transactional
    @Override
    public String resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new ApiException("User not found with given username: "+request.getEmail(), HttpStatus.BAD_REQUEST)
        );

        String newRawPassword = AppUtil.generateRandomPassword(10);
        user.setPassword(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);

        Map<String, Object> emailAttributes = new HashMap<>();
        emailAttributes.put("name", user.getName());
        emailAttributes.put("newRawPassword", newRawPassword);

        sendEmail(user.getEmail(), "Reset password", "reset-password-email", emailAttributes);

        return "A new password has been sent to your email.";
    }

    @Transactional
    @Override
    public String resetPasswordForUser(ResetPasswordForUserRequest request) {

        User user = userRepository.findById(request.getId()).orElseThrow(
                () -> new ApiException("User not found with given username: "+request.getId(), HttpStatus.BAD_REQUEST)
        );

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        Map<String, Object> emailAttributes = new HashMap<>();
        emailAttributes.put("name", user.getName());
        emailAttributes.put("newRawPassword", request.getNewPassword());

        sendEmail(user.getEmail(), "Reset password", "reset-password-email", emailAttributes);

        return "Reset user's password successfully!";
    }

    @Override
    public RefreshTokenResponse getNewAccessToken(RefreshTokenRequest request) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken()).orElseThrow(
                () -> new ApiException("Invalid refresh token",HttpStatus.BAD_REQUEST)
        );

        if(!refreshTokenService.validateRefreshToken(refreshToken)){
            throw new ApiException("Refresh token was expired. Please login again!", HttpStatus.BAD_REQUEST);
        }

        String accessToken = jwtProvider.generateToken(refreshToken.getUser());

        RefreshTokenResponse response = RefreshTokenResponse
                .builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();

        return response;
    }


    private void sendEmail(String email,String subject, String template, Map<String, Object> attributes){
        emailSenderService.sendEmail(email,subject, template, attributes);
    }
}
