package com.chat.messaging.dto;

import lombok.Data;

@Data
public class CreateRoomRequest {
    private String roomName;
    private String creatorEmail;
}