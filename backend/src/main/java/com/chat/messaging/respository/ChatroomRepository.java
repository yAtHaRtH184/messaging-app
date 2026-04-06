package com.chat.messaging.respository;

import com.chat.messaging.entity.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, UUID> {
    Optional<Chatroom> findByName(String name);

    @Query("select c from Chatroom c left join fetch c.participants where c.name = :name")
    Optional<Chatroom> findByNameWithParticipants(@Param("name") String name);
}
