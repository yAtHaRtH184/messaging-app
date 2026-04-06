package com.chat.messaging.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatroomResponse {
    UUID id;
    String name;
    String type;
    String createdBy;
}
