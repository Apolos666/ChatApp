package com.chatapp.userservice.controller.admin;

import com.chatapp.userservice.dto.auth.request.ResetPasswordForUserRequest;
import com.chatapp.userservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    AuthService authService;

    @PostMapping("/user-reset-pass")
    public ResponseEntity<?> resetPasswordForUser(@RequestBody @Valid ResetPasswordForUserRequest request){
        return ResponseEntity.status(HttpStatus.OK).body((authService.resetPasswordForUser(request)));
    }

}
