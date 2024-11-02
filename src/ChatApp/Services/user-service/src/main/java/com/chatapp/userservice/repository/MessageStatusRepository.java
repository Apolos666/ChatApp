package com.chatapp.userservice.repository;

import com.chatapp.userservice.entity.MessageStatus;
import com.chatapp.userservice.entity.keys.MessageStatusId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface MessageStatusRepository extends JpaRepository<MessageStatus, MessageStatusId> {

    @Query("SELECT m FROM MessageStatus m WHERE m.id.messageId=?1")
    MessageStatus findByMessageId(int messageId);

    @Modifying
    @Query("UPDATE MessageStatus m SET m.status = ?2 WHERE m.message.id = ?1")
    void updateMessageStatus(int messageId, String status);
}
