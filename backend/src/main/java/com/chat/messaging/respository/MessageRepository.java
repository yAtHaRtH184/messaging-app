package com.chat.messaging.respository;

import com.chat.messaging.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.UUID;
@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    Page<Message> findByChatroomId(UUID chatroomId, Pageable pageable);
}
