package com.chatapp.userservice.controller.moderate;

import com.chatapp.userservice.dto.room.RoomDto;
import com.chatapp.userservice.dto.room.request.RoomCreationRequest;
import com.chatapp.userservice.security.CustomizedUserDetails;
import com.chatapp.userservice.service.RoomService;
import com.chatapp.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/management/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private final UserService userService;

    // get all rooms (ADMIN)
    @GetMapping("")
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        List<RoomDto> rooms = roomService.getAllRooms();
        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    // Get all created room by creator id (MODERATE USER)
    @GetMapping("/creator")
    public ResponseEntity<List<RoomDto>> getAllCreatedRoomsByCreatorId(@AuthenticationPrincipal CustomizedUserDetails userDetails) {
        List<RoomDto> rooms = roomService.getAllCreatedRoomByCreatorId(userDetails.getId());
        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    // Get all joined room by user id (USER)
    @GetMapping("/user")
    public ResponseEntity<List<RoomDto>> getAllJoinedRoomsByUserId(@AuthenticationPrincipal CustomizedUserDetails userDetails) {
        List<RoomDto> rooms = roomService.getAllRoomsByUserId(userDetails.getId());
        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    @PostMapping("/creation")
    public ResponseEntity<RoomDto> createRoom(
            @AuthenticationPrincipal CustomizedUserDetails userDetails,
            @RequestBody RoomCreationRequest request) {
        request.setCreatorId(userDetails.getId());
        RoomDto roomDto = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(roomDto);
    }

    @PostMapping("/{roomId}/user/{userId}")
    public ResponseEntity<RoomDto> addUserToRoom(
            @PathVariable("roomId") int roomId,
            @PathVariable("userId") int userId) {
        RoomDto updatedRoom = roomService.addUserToRoom(roomId, userId);
        return ResponseEntity.status(HttpStatus.OK).body(updatedRoom);
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
