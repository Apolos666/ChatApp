package com.chatapp.userservice.dto.auth.request;

import com.chatapp.userservice.validator.password.PasswordConstraint;
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
public class PasswordModifyRequest {
    @NotBlank(message = "Old password must be not blank or null")
    @NotNull(message = "Old password must be not null")
    @Size(min = 8, max = 16, message = "Old password must be between 8 and 16 characters")
    @PasswordConstraint
    String oldPassword;

    @NotBlank(message = "New password must be not blank or null")
    @NotNull(message = "New password must be not null")
    @Size(min = 8, max = 16, message = "New password must be between 8 and 16 characters")
    @PasswordConstraint
    String newPassword;
}
