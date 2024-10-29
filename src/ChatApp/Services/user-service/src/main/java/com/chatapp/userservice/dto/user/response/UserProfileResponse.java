package com.chatapp.userservice.dto.user.response;

import com.chatapp.userservice.dto.role.RoleDto;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {

    int id;
    String name;
    String phoneNumber;
    Date dob;
    String address;
    String email;
    RoleDto role;

}
