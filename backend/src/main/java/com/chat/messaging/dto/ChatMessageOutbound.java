package com.chat.messaging.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Data
@RequiredArgsConstructor
public class ChatMessageOutbound {
    private String roomName;
    private String content;
    private String sender;
}
