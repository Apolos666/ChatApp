package com.chatapp.userservice.controller.common;

import com.chatapp.userservice.constant.AppConstant;
import com.chatapp.userservice.dto.user.request.UserProfileRequest;
import com.chatapp.userservice.security.CustomizedUserDetails;
import com.chatapp.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
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

    @PostMapping("/avatar")
    public ResponseEntity<?> updateAvatar(@AuthenticationPrincipal CustomizedUserDetails userDetails,
                                          @RequestPart MultipartFile file){
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUserAvatar(userDetails.getId(),file));
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<?> deleteAvatar(@AuthenticationPrincipal CustomizedUserDetails userDetails){
        return ResponseEntity.status(HttpStatus.OK).body(userService.deleteUserAvatar(userDetails.getId()));
    }

    @GetMapping ("/search")
    public ResponseEntity<?> searchUserByName(
        @RequestParam(required = false, defaultValue = AppConstant.DEFAULT_PAGE_SIZE) int pageSize,
        @RequestParam(required = false, defaultValue = AppConstant.DEFAULT_PAGE_NUMBER) int pageNumber,
        @RequestParam(required = false, defaultValue = AppConstant.DEFAULT_SORT_BY) String sortBy,
        @RequestParam(required = false, defaultValue = AppConstant.DEFAULT_SORT_DIR) String sortDir,
        @RequestParam(value = "name") String name
    ){
        return ResponseEntity.status(HttpStatus.OK).body(userService.searchUser(pageSize, pageNumber, sortBy, sortDir, name));
    }

}
