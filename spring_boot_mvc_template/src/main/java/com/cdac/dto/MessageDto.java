package com.cdac.dto;

import com.cdac.entity.MessageType;
import lombok.Data;

@Data
public class MessageDto {
    private Long chatRoomId;
    private Long senderId;
    private String content;
    private MessageType messageType;
    private Long orderId; // Optional
}
