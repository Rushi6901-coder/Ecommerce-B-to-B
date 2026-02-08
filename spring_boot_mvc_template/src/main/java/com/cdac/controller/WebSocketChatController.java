package com.cdac.controller;

import com.cdac.dto.ChatMessageDto;
import com.cdac.entity.Message;
import com.cdac.entity.ChatRoom;
import com.cdac.entity.MessageType;
import com.cdac.repository.MessageRepository;
import com.cdac.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class WebSocketChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private com.cdac.repository.UserRepository userRepository;

    /**
     * Handles messages sent to /app/chat.send/{chatRoomId}
     * Broadcasts the message to /topic/chat/{chatRoomId}
     */
    @MessageMapping("/chat.send/{chatRoomId}")
    @SendTo("/topic/chat/{chatRoomId}")
    public ChatMessageDto sendMessage(@DestinationVariable Long chatRoomId, ChatMessageDto messageDto) {
        try {
            // Set timestamp if not provided
            if (messageDto.getTimestamp() == null) {
                messageDto.setTimestamp(LocalDateTime.now());
            }

            // Verify chat room exists
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
            if (chatRoom == null) {
                throw new RuntimeException("Chat room not found: " + chatRoomId);
            }
            
            // Verify sender exists
            com.cdac.entity.User sender = userRepository.findById(messageDto.getSenderId()).orElse(null);
            if (sender == null) {
                 throw new RuntimeException("Sender not found: " + messageDto.getSenderId());
            }

            // Save message to database using existing Message entity
            Message message = new Message();
            message.setChatRoom(chatRoom);
            message.setSender(sender);
            message.setContent(messageDto.getContent());
            
            // Handle MessageType enum
            try {
                if (messageDto.getMessageType() != null) {
                    message.setMessageType(MessageType.valueOf(messageDto.getMessageType().toUpperCase()));
                } else {
                    message.setMessageType(MessageType.TEXT);
                }
            } catch (IllegalArgumentException e) {
                message.setMessageType(MessageType.TEXT);
            }
            
            message.setTimestamp(messageDto.getTimestamp());

            messageRepository.save(message);

            // Broadcast message to all subscribers
            // Enrich DTO with sender name if missing
            if (messageDto.getSenderName() == null) {
                messageDto.setSenderName(sender.getName());
            }
            
            messageDto.setId(message.getId());
            
            return messageDto;

        } catch (Exception e) {
            e.printStackTrace();
            // Return error message
            ChatMessageDto errorMsg = new ChatMessageDto();
            errorMsg.setChatRoomId(chatRoomId);
            errorMsg.setContent("Error: " + e.getMessage());
            errorMsg.setMessageType("ERROR");
            errorMsg.setTimestamp(LocalDateTime.now());
            return errorMsg;
        }
    }

    /**
     * Handles typing indicator
     */
    @MessageMapping("/chat.typing/{chatRoomId}")
    @SendTo("/topic/chat/{chatRoomId}/typing")
    public ChatMessageDto handleTyping(@DestinationVariable Long chatRoomId, ChatMessageDto messageDto) {
        return messageDto;
    }
}
