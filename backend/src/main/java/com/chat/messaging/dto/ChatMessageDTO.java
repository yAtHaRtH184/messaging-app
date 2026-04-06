package com.chat.messaging.dto;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {
    private String roomName;
    private String content;
    private String senderEmail;
}
