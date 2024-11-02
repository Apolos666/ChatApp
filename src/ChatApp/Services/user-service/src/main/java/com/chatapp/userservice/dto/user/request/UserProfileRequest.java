package com.chatapp.userservice.dto.user.request;

import com.chatapp.userservice.validator.user.DobConstraint;
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
public class UserProfileRequest {

    @NotBlank(message = "Name must be not blank or null")
    @NotNull(message = "Name must be not null")
    @Size(max = 50, message = "Name be less than 50 characters")
    String name;

    @NotBlank(message = "Phone number must be not blank or null")
    @NotNull(message = "Phone number must be not null")
    @Size(min = 9,max = 11, message = "Phone number be between 9 and 11 digits")
    String phoneNumber;

    @DobConstraint(min = 10)
    Date dob;

    @NotBlank(message = "Address must be not blank or null")
    @NotNull(message = "Address must be not null")
    String address;

}
