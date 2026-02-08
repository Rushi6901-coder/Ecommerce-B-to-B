package com.cdac.controller;

import com.cdac.service.OrderService;
import com.cdac.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalVendors", userService.getAllVendors().size());
            stats.put("totalShopkeepers", userService.getAllShopkeepers().size());
            stats.put("totalOrders", orderService.getAllOrders().size());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
