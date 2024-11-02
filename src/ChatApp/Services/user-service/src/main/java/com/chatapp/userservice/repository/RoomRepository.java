package com.chatapp.userservice.repository;

import com.chatapp.userservice.entity.Room;
import com.chatapp.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("SELECT r FROM Room r JOIN r.users u WHERE u.id = ?1")
    List<Room> findJoinedRoomsByUserId(int userId);

    @Query("SELECT r FROM Room r WHERE r.user.id = ?1")
    List<Room> findByCreatorId(int userId);

    void deleteByUser(User user);
}
