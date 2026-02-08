package com.cdac.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders") // "order" is a reserved keyword in SQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shopkeeper_id", nullable = false)
    private Shopkeeper shopkeeper;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType; // DIRECT or CHAT_BASED
    
    private Long chatRoomId; // Optional: Only populated for chat-based orders
    
    @Column(name = "transaction_id")
    private String transactionId; // Razorpay Payment ID or Order ID

    private LocalDateTime orderDate;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<OrderItem> orderItems;
}
