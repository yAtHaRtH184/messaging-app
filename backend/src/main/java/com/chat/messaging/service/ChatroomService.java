package com.chat.messaging.service;

import com.chat.messaging.entity.Chatroom;
import com.chat.messaging.entity.User;
import com.chat.messaging.respository.ChatroomRepository;
import com.chat.messaging.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatroomService {
    private final ChatroomRepository chatroomRepository;
    private final UserRepository userRepository;

    public Chatroom createRoom(String roomName) {
        if (chatroomRepository.findByName(roomName).isPresent()) {
            throw new RuntimeException("Room already exists");
        }
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User creator=userRepository.findByEmail(email)
                .orElseThrow();
        Set<User> participants = new HashSet<>();
        participants.add(creator);

        Chatroom room = Chatroom.builder()
                .name(roomName)
                .type("GROUP")
                .createdBy(creator)
                .participants(participants)
                .build();

        Chatroom saved = chatroomRepository.save(room);
        return saved;
    }

    public Chatroom joinRoom(String roomName){
        Chatroom room= chatroomRepository.findByName(roomName)
                .orElseThrow();
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user=userRepository.findByEmail(email)
                .orElseThrow();
        room.getParticipants().add(user);
        return chatroomRepository.save(room);
    }
}
