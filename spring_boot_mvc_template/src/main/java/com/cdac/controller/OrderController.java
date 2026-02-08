package com.cdac.controller;

import com.cdac.dto.OrderRequestDto;
import com.cdac.entity.Order;
import com.cdac.entity.OrderStatus;
import com.cdac.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequestDto dto) {
        try {
            Order order = orderService.placeOrder(dto);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/shopkeeper/{id}")
    public List<Order> getOrdersByShopkeeper(@PathVariable Long id) {
        return orderService.getOrdersByShopkeeper(id);
    }

    @GetMapping("/vendor/{id}")
    public List<Order> getOrdersByVendor(@PathVariable Long id) {
        return orderService.getOrdersByVendor(id);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            OrderStatus status = OrderStatus.valueOf(statusUpdate.get("status"));
            Order order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
