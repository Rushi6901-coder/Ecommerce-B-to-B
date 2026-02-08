package com.cdac.controller;

import com.cdac.dto.MessageDto;
import com.cdac.entity.ChatRoom;
import com.cdac.entity.Message;
import com.cdac.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/room")
    public ChatRoom startChat(@RequestParam Long vendorId, @RequestParam Long shopkeeperId) {
        return chatService.createOrGetChatRoom(vendorId, shopkeeperId);
    }

    @GetMapping("/active-rooms/vendor/{vendorId}")
    public List<ChatRoom> getVendorRooms(@PathVariable Long vendorId) {
        return chatService.getChatRoomsForVendor(vendorId);
    }

    @GetMapping("/active-rooms/shopkeeper/{shopkeeperId}")
    public List<ChatRoom> getShopkeeperRooms(@PathVariable Long shopkeeperId) {
        return chatService.getChatRoomsForShopkeeper(shopkeeperId);
    }

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody MessageDto dto) {
        try {
            Message message = chatService.sendMessage(dto);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/room/{roomId}/messages")
    public List<Message> getMessages(@PathVariable Long roomId) {
        return chatService.getMessages(roomId);
    }
    
    @PostMapping("/estimation")
    public ResponseEntity<?> sendEstimation(
            @RequestParam Long chatRoomId,
            @RequestParam Long senderId,
            @RequestBody com.cdac.dto.OrderRequestDto orderDto) {
        try {
            Message message = chatService.sendEstimation(chatRoomId, senderId, orderDto);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/invoice")
    public ResponseEntity<?> sendInvoice(
            @RequestParam Long chatRoomId,
            @RequestParam Long senderId,
            @RequestParam Long orderId,
            @RequestBody String invoiceContent) {
        try {
            Message message = chatService.sendInvoice(chatRoomId, senderId, orderId, invoiceContent);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
