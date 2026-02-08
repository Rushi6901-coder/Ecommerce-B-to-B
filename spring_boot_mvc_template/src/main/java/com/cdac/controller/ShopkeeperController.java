package com.cdac.controller;

import com.cdac.entity.Cart;
import com.cdac.service.CartService;
import com.cdac.service.OrderService;
import com.cdac.security.JwtUtils;
import com.cdac.dto.ShopkeeperUpdateRequest;
import com.cdac.entity.Shopkeeper;
import com.cdac.repository.ShopkeeperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/shopkeeper")
public class ShopkeeperController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private ShopkeeperRepository shopkeeperRepository;

    @PostMapping("/cart/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request, HttpServletRequest httpRequest) {
        try {
            Long shopkeeperId = extractShopkeeperIdFromToken(httpRequest);
            cartService.addToCart(shopkeeperId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok("Product added to cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCart(HttpServletRequest httpRequest) {
        try {
            Long shopkeeperId = extractShopkeeperIdFromToken(httpRequest);
            return ResponseEntity.ok(cartService.getCartItems(shopkeeperId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cart/checkout")
    public ResponseEntity<?> checkout(HttpServletRequest httpRequest) {
        try {
            Long shopkeeperId = extractShopkeeperIdFromToken(httpRequest);
            return ResponseEntity.ok(orderService.createDirectOrder(shopkeeperId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cart/estimation")
    public ResponseEntity<?> requestEstimation(HttpServletRequest httpRequest) {
        try {
            Long shopkeeperId = extractShopkeeperIdFromToken(httpRequest);
            return ResponseEntity.ok(orderService.createEstimationRequest(shopkeeperId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/total-expense")
    public ResponseEntity<?> getTotalExpense(HttpServletRequest httpRequest) {
        try {
            Long shopkeeperId = extractShopkeeperIdFromToken(httpRequest);
            return ResponseEntity.ok(orderService.getTotalExpense(shopkeeperId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Long extractShopkeeperIdFromToken(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        Long userId = jwtUtils.extractUserId(token);
        Shopkeeper shopkeeper = shopkeeperRepository.findByUserId(userId);
        if (shopkeeper == null) {
            throw new RuntimeException("Shopkeeper profile not found for user id: " + userId);
        }
        return shopkeeper.getId();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getShopkeeperById(@PathVariable Long id) {
        try {
            Shopkeeper shopkeeper = shopkeeperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
            return ResponseEntity.ok(shopkeeper);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateShopkeeper(@PathVariable Long id, @RequestBody ShopkeeperUpdateRequest request) {
        try {
            Shopkeeper shopkeeper = shopkeeperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
            
            shopkeeper.setShopName(request.getShopName());
            shopkeeper.setShopAddress(request.getShopAddress());
            shopkeeper.setLicenseNumber(request.getLicenseNumber());
            
            shopkeeperRepository.save(shopkeeper);
            return ResponseEntity.ok("Shopkeeper updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new RuntimeException("No valid token found");
    }

    public static class CartRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}