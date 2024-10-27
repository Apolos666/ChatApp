package com.chatapp.userservice.controller.common;

import com.chatapp.userservice.dto.auth.request.*;
import com.chatapp.userservice.security.CustomizedUserDetails;
import com.chatapp.userservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(authService.login(request));
    }

    @PostMapping("/password/modification")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal CustomizedUserDetails userDetails,
                                            @RequestBody @Valid PasswordModifyRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(authService.changePassword(userDetails.getId(), request));
    }

    @PostMapping("/registration")
    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerAccount(request));
    }

    @PostMapping("/activation")
    public ResponseEntity<?> activateAccount(@RequestBody @Valid ActivationAccountRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(authService.activateAccount(request));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(authService.resetPassword(request));
    }
}
