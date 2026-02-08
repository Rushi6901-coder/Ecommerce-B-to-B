package com.cdac.controller;

import com.cdac.service.ProductService;
import com.cdac.service.OrderService;
import com.cdac.service.VendorService;
import com.cdac.security.JwtUtils;
import com.cdac.entity.OrderStatus;
import com.cdac.dto.VendorUpdateRequest;
import com.cdac.dto.VendorDto;
import com.cdac.entity.Vendor;
import com.cdac.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/vendor")
public class VendorController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private VendorService vendorService;

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam int discount,
            @RequestParam int stockQuantity,
            @RequestParam Long subCategoryId,
            @RequestParam(required = false) MultipartFile image,
            HttpServletRequest httpRequest) {
        try {
            Long vendorId = extractVendorIdFromToken(httpRequest);
            return ResponseEntity.ok(productService.addProduct(name, description, price, discount, 
                    stockQuantity, subCategoryId, vendorId, image));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/products")
    public ResponseEntity<?> getMyProducts(HttpServletRequest httpRequest) {
        try {
            Long vendorId = extractVendorIdFromToken(httpRequest);
            return ResponseEntity.ok(productService.getProductsByVendor(vendorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/products/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam int discount,
            @RequestParam int stockQuantity,
            @RequestParam Long subCategoryId,
            @RequestParam(required = false) MultipartFile image) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, name, description, price, 
                    discount, stockQuantity, subCategoryId, image));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getMyOrders(HttpServletRequest httpRequest) {
        try {
            Long vendorId = extractVendorIdFromToken(httpRequest);
            return ResponseEntity.ok(orderService.getOrdersByVendor(vendorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getVendorById(@PathVariable Long id) {
        try {
            Vendor vendor = vendorService.getVendorById(id);
            return ResponseEntity.ok(vendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVendor(@PathVariable Long id, @RequestBody VendorUpdateRequest request) {
        try {
            VendorDto dto = new VendorDto();
            dto.setBusinessName(request.getBusinessName());
            dto.setBusinessCategory(request.getBusinessCategory());
            dto.setGstNumber(request.getGstNumber());
            
            Vendor updatedVendor = vendorService.updateVendor(id, dto);
            return ResponseEntity.ok(updatedVendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Long extractVendorIdFromToken(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        return jwtUtils.extractUserId(token);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new RuntimeException("No valid token found");
    }
}