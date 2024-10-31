package com.chatapp.userservice.service.impl;

import com.chatapp.userservice.dto.room.RoomDto;
import com.chatapp.userservice.dto.UserDto;
import com.chatapp.userservice.dto.room.request.RoomCreationRequest;
import com.chatapp.userservice.entity.Room;
import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.exception.ApiException;
import com.chatapp.userservice.repository.RoomRepository;
import com.chatapp.userservice.repository.UserRepository;
import com.chatapp.userservice.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    public List<RoomDto> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();

        return rooms.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomDto> getAllCreatedRoomByCreatorId(int userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found with given id: "+userId, HttpStatus.BAD_REQUEST));

        List<Room> rooms = roomRepository.findByCreatorId(userId);

        return rooms.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
    }

    @Override
    public List<RoomDto> getAllRoomsByUserId(int userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found with given id: "+userId, HttpStatus.BAD_REQUEST));

        List<Room> rooms = roomRepository.findJoinedRoomsByUserId(userId);

        return rooms.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoomDto createRoom(RoomCreationRequest request) {
        String roomName = request.getName();
        int creatorId = request.getCreatorId();

        User creator = userRepository.findById(creatorId)
                .orElseThrow(()->new ApiException("User not found", HttpStatus.BAD_REQUEST));

        Room room = new Room();
        room.setName(roomName);
        room.setUser(creator);
        room.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        roomRepository.save(room);

        return convertToDTO(room);
    }

    @Override
    public RoomDto addUserToRoom(int roomId, int userId) {
        Optional<Room> roomOptional = roomRepository.findById(roomId);
        Optional<User> userOptional = userRepository.findById(userId);

        roomOptional.orElseThrow(() -> new ApiException("Room not found", HttpStatus.BAD_REQUEST));
        userOptional.orElseThrow(() -> new ApiException("User not found", HttpStatus.BAD_REQUEST));

        Room room = roomOptional.get();
        User user = userOptional.get();

        // Check whether user is in room
        if (room.getUsers().contains(user)) {
            throw new ApiException("User with given id: "+userId+" was in the room", HttpStatus.BAD_REQUEST);
        }

        room.getUsers().add(user);
        roomRepository.save(room);

        return convertToDTO(room);
    }

    @Override
    public String deleteRoom(int roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException("Room not found", HttpStatus.BAD_REQUEST));

        roomRepository.deleteById(roomId);

        return "Delete room with given id: "+roomId+" successfully";
    }

    @Override
    public String removeUserFromRoom(int roomId, int userId) {
        Optional<Room> roomOptional = roomRepository.findById(roomId);
        Optional<User> userOptional = userRepository.findById(userId);

        roomOptional.orElseThrow(() -> new ApiException("Room not found", HttpStatus.BAD_REQUEST));
        userOptional.orElseThrow(() -> new ApiException("User not found", HttpStatus.BAD_REQUEST));

        Room room = roomOptional.get();
        User user = userOptional.get();

        // Check whether user is in room
        if (!room.getUsers().contains(user)) {
            throw new RuntimeException("User with given id: "+userId+" wasn't in the room");
        }

        room.getUsers().remove(user);
        roomRepository.save(room);

        return "Remove user from room successfully!";
    }

    private RoomDto convertToDTO(Room room) {

        List<UserDto> userDTOs = room.getUsers().stream()
                .map(user -> new UserDto(user.getId(), user.getName(), user.getEmail()))
                .collect(Collectors.toList());

        return new RoomDto(
                room.getId(),
                room.getName(),
                room.getCreatedAt().toString(),
                room.getUpdatedAt() != null ? room.getUpdatedAt().toString() : null,
                room.getUser().getId(),
                userDTOs
        );
    }

}
