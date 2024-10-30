package com.chatapp.userservice.controller;

import com.chatapp.userservice.dto.room.RoomDto;
import com.chatapp.userservice.dto.room.request.RoomCreationRequest;
import com.chatapp.userservice.entity.Room;
import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.service.RoomService;
import com.chatapp.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/management/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private final UserService userService;

    // Get all created room by creator id
    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<RoomDto>> getAllCreatedRoomsByCreatorId(@PathVariable("userId") int userId) {

        List<RoomDto> rooms = roomService.getAllCreatedRoomByCreatorId(userId);

        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    // Get all joined room by user id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RoomDto>> getAllJoinedRoomsByUserId(@PathVariable("userId") int userId) {

        List<RoomDto> rooms = roomService.getAllRoomsByUserId(userId);

        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    @PostMapping("/creation")
    public ResponseEntity<RoomDto> createRoom(@RequestBody RoomCreationRequest request) {
//        // Get authenticated User
//        String email = authentication.getName();

        RoomDto roomDto = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(roomDto);
    }

    @PostMapping("/{roomId}/user/{userId}")
    public ResponseEntity<RoomDto> addUserToRoom(
            @PathVariable("roomId") int roomId,
            @PathVariable("userId") int userId) {
        try {

            RoomDto updatedRoom = roomService.addUserToRoom(roomId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(updatedRoom);

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

        }
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteRoom(
            @PathVariable("roomId") int roomId) {

        String result = roomService.deleteRoom(roomId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    
    @DeleteMapping("/{roomId}/user/{userId}")
    public ResponseEntity<?> removeUserFromRoom(
            @PathVariable("roomId") int roomId,
            @PathVariable("userId") int userId) {

        String result = roomService.removeUserFromRoom(roomId, userId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
