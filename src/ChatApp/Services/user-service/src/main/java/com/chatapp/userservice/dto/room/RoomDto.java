package com.chatapp.userservice.dto.room;

import com.chatapp.userservice.dto.UserDto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomDto {
    private int id;
    private String name;
    private String createdAt;
    private String updatedAt;
    private int creatorId;
    private List<UserDto> members;
}
