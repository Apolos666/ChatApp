package com.chatapp.userservice.controller.common;

import com.chatapp.userservice.dto.user.request.UserProfileRequest;
import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.security.CustomizedUserDetails;
import com.chatapp.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true",
    exposedHeaders = {
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials"
    }
)
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal CustomizedUserDetails userDetails){
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUserProfile(userDetails.getId()));
    }

    @PostMapping("/profile")
    public ResponseEntity<?> changeUserProfile(@AuthenticationPrincipal CustomizedUserDetails userDetails,
                                               @RequestBody @Valid UserProfileRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUserProfile(userDetails.getId(),request));
    }

}
