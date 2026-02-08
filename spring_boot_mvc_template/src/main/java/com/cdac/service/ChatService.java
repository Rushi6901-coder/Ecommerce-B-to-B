package com.cdac.service;

import com.cdac.dto.MessageDto;
import com.cdac.entity.*;
import com.cdac.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ShopkeeperRepository shopkeeperRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    public ChatRoom createOrGetChatRoom(Long vendorId, Long shopkeeperId) {
        return chatRoomRepository.findByVendorIdAndShopkeeperId(vendorId, shopkeeperId)
                .orElseGet(() -> {
                    Vendor vendor = vendorRepository.findById(vendorId)
                            .orElseThrow(() -> new RuntimeException("Vendor not found"));
                    Shopkeeper shopkeeper = shopkeeperRepository.findById(shopkeeperId)
                            .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));

                    ChatRoom chatRoom = new ChatRoom();
                    chatRoom.setVendor(vendor);
                    chatRoom.setShopkeeper(shopkeeper);
                    chatRoom.setCreatedAt(LocalDateTime.now());
                    return chatRoomRepository.save(chatRoom);
                });
    }

    public List<ChatRoom> getChatRoomsForVendor(Long vendorId) {
        return chatRoomRepository.findByVendorId(vendorId);
    }
    
    public List<ChatRoom> getChatRoomsForShopkeeper(Long shopkeeperId) {
        return chatRoomRepository.findByShopkeeperId(shopkeeperId);
    }

    
    public Message sendMessage(MessageDto dto) {
        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("ChatRoom not found"));
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(dto.getContent());
        message.setMessageType(dto.getMessageType() != null ? dto.getMessageType() : MessageType.TEXT);
        message.setTimestamp(LocalDateTime.now());
        
        if (dto.getOrderId() != null) {
             Order order = orderRepository.findById(dto.getOrderId()).orElse(null);
             message.setOrder(order);
        }

        return messageRepository.save(message);
    }

    public List<Message> getMessages(Long chatRoomId) {
        return messageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
    }
    
    // Additional repositories needed for estimation/invoice
    @Autowired
    private ProductRepository productRepository;
    
    // Create order from estimation message
    public Message sendEstimation(Long chatRoomId, Long senderId, com.cdac.dto.OrderRequestDto orderDto) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create the order
        Order order = new Order();
        order.setShopkeeper(chatRoom.getShopkeeper());
        order.setVendor(chatRoom.getVendor());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderType(OrderType.CHAT_BASED);
        order.setChatRoomId(chatRoomId);
        order.setOrderDate(LocalDateTime.now());
        
        // Add order items
        List<OrderItem> orderItems = new java.util.ArrayList<>();
        java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;
        
        for (com.cdac.dto.OrderItemDto itemDto : orderDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            orderItems.add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(java.math.BigDecimal.valueOf(itemDto.getQuantity())));
        }
        
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        // Create estimation message
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setMessageType(MessageType.ESTIMATION);
        message.setContent("Estimation sent: Order #" + savedOrder.getId() + " - Total: ₹" + totalAmount);
        message.setOrder(savedOrder);
        message.setTimestamp(LocalDateTime.now());
        
        return messageRepository.save(message);
    }
    
    // Update order from invoice message
    public Message sendInvoice(Long chatRoomId, Long senderId, Long orderId, String invoiceContent) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Update order status when invoice is sent
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        
        // Create invoice message
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setMessageType(MessageType.INVOICE);
        message.setContent(invoiceContent);
        message.setOrder(order);
        message.setTimestamp(LocalDateTime.now());
        
        return messageRepository.save(message);
    }
}
