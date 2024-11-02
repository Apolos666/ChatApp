package com.chatapp.userservice.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {

    @NotBlank(message = "Email must be not blank or null")
    @NotNull(message = "Email must be not null")
    @Email(message = "Email must be in the correct format")
    String email;

    @NotBlank(message = "Password must be not blank or null")
    @NotNull(message = "Password must be not null")
    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    String password;

}
