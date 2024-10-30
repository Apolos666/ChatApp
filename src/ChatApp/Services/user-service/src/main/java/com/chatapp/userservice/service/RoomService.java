package com.chatapp.userservice.service;

import com.chatapp.userservice.dto.room.RoomDto;
import com.chatapp.userservice.dto.room.request.RoomCreationRequest;

import java.util.List;

public interface RoomService {

    List<RoomDto> getAllCreatedRoomByCreatorId(int userId);
    List<RoomDto> getAllRoomsByUserId(int userId);
    RoomDto createRoom(RoomCreationRequest request);
    RoomDto addUserToRoom(int roomId, int userId);
    String deleteRoom(int roomId);
    String removeUserFromRoom(int roomId, int userId);
}
