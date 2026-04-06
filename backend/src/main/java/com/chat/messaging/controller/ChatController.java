package com.chat.messaging.controller;

import com.chat.messaging.dto.ChatMessageDTO;
import com.chat.messaging.dto.ChatMessageOutbound;
import com.chat.messaging.entity.Chatroom;
import com.chat.messaging.entity.Message;
import com.chat.messaging.entity.User;
import com.chat.messaging.respository.ChatroomRepository;
import com.chat.messaging.respository.MessageRepository;
import com.chat.messaging.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ChatroomRepository chatroomRepository;
    private final MessageRepository messageRepository;
    @MessageMapping("/chat.send")
    @Transactional
    public void sendMessage(ChatMessageDTO dto, Principal principal) {
        String email = principal != null ? principal.getName() : dto.getSenderEmail();
        if (email == null) {
            throw new RuntimeException("Unauthenticated: no email available");
        }

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Chatroom room = chatroomRepository.findByNameWithParticipants(dto.getRoomName())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        boolean member = room.getParticipants().stream()
                .anyMatch(u -> u.getId().equals(sender.getId()));

        if (!member) {
            throw new RuntimeException("User not part of this chatroom");
        }

        Message message = Message.builder()
                .content(dto.getContent())
                .timeStamp(LocalDateTime.now())
                .status("SENT")
                .sender(sender)
                .chatroom(room)
                .build();
        messageRepository.save(message);

        // publish username back to clients
        messagingTemplate.convertAndSend(
                "/topic/" + room.getName(),
                new ChatMessageOutbound(room.getName(), dto.getContent(), sender.getUsername())
        );
    }


}
