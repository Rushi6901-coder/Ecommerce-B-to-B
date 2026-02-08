package com.cdac.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private Long id;
    private Long chatRoomId;
    private Long senderId;
    private String senderRole; // SHOPKEEPER, VENDOR, or ADMIN
    private String senderName;
    private String content;
    private String messageType; // TEXT, ESTIMATION, INVOICE
    private LocalDateTime timestamp;
}
