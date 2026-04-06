package com.chat.messaging.controller;

import com.chat.messaging.dto.ChatroomResponse;
import com.chat.messaging.dto.CreateRoomRequest;
import com.chat.messaging.dto.JoinRoomRequest;
import com.chat.messaging.entity.Chatroom;
import com.chat.messaging.entity.Message;
import com.chat.messaging.respository.MessageRepository;
import com.chat.messaging.service.ChatroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import  org.springframework.data.domain.Pageable ;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
public class ChatroomController {
    private final ChatroomService chatroomService;
    private final MessageRepository messageRepository;
    @PostMapping("/create")
    public ChatroomResponse createRoom(@RequestBody CreateRoomRequest createRoomRequest){
        Chatroom room =chatroomService.createRoom(
                createRoomRequest.getRoomName()
        );
        return new ChatroomResponse(
                room.getId(),
                room.getName(),
                room.getType(),
                room.getCreatedBy().getUsername()
        );
    }

    @PostMapping("/join")
    public ChatroomResponse joinRoom(@RequestBody JoinRoomRequest request){
         Chatroom room = chatroomService.joinRoom(request.getRoomName());
         return new ChatroomResponse(
                 room.getId(),
                 room.getName(),
                 room.getType(),
                 room.getCreatedBy().getUsername()
         );
    }

    @GetMapping("history/{chatroomID}")
    public Page<Message> getHistory(@PathVariable("chatroomID") UUID chatroomID,
                                    @RequestParam(name = "page", defaultValue = "0") int page,
                                    @RequestParam(name = "size", defaultValue = "20") int size) {
        Pageable pageable=PageRequest.of(
                page,
                size,
                Sort.by("timeStamp").descending()
        );
        return messageRepository.findByChatroomId(chatroomID, pageable);
    }


}
