package com.chatapp.userservice.dto.auth.request;

import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordForUserRequest {
    
    @NotNull(message = "User ID must not be null")
    @Min(value = 1, message = "User ID must be a positive integer")
    int id;

    @NotBlank(message = "New password must be not blank or null")
    @NotNull(message = "New password must be not null")
    @Size(min = 6, max = 40, message = "New password must be between 6 and 40 characters")
    String newPassword;

}