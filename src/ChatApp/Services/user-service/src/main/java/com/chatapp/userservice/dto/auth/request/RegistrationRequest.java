package com.chatapp.userservice.dto.auth.request;

import com.chatapp.userservice.validator.user.DobConstraint;
import com.chatapp.userservice.validator.password.PasswordConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegistrationRequest {

    @NotBlank(message = "Name must be not blank or null")
    @NotNull(message = "Name must be not null")
    @Size(max = 50, message = "Name must be less than 50 characters")
    String name;

    @NotBlank(message = "Phone number must be not blank or null")
    @NotNull(message = "Phone number must be not null")
    @Size(min = 9, max = 11, message = "Phone number must be between 9 and 11 digits")
    String phoneNumber;

    @DobConstraint(min = 10)
    Date dob;

    @NotBlank(message = "Address must be not blank or null")
    @NotNull(message = "Address must be not null")
    String address;

    @NotBlank(message = "Email must be not blank or null")
    @NotNull(message = "Email must be not null")
    @Email(message = "Email must be in the correct format")
    String email;

    @NotBlank(message = "Password must be not blank or null")
    @NotNull(message = "Password must be not null")
    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    @PasswordConstraint
    String password;
}
