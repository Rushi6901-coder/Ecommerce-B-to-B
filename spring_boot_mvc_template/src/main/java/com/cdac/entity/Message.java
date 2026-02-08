package com.cdac.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private MessageType messageType; // TEXT, ESTIMATION, INVOICE

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order; // Optional link to an order

    private LocalDateTime timestamp;
}
