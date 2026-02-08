package com.cdac.controller;

import com.cdac.dto.UserLoginDto;
import com.cdac.dto.UserRegistrationDto;
import com.cdac.dto.UserUpdateRequest;
import com.cdac.entity.User;
import com.cdac.service.UserService;
import com.cdac.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private com.cdac.repository.UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto dto) {
        try {
            User user = userService.registerUser(dto);
            return ResponseEntity.ok(mapToDto(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/vendor-register")
    public ResponseEntity<?> registerVendor(@RequestBody com.cdac.dto.VendorDto vendorDto) {
        try {
            userService.registerVendor(vendorDto);
            return ResponseEntity.ok("Vendor details added successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/shopkeeper-register")
    public ResponseEntity<?> registerShopkeeper(@RequestBody com.cdac.dto.ShopkeeperDto shopkeeperDto) {
        try {
            userService.registerShopkeeper(shopkeeperDto);
            return ResponseEntity.ok("Shopkeeper details added successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDto dto) {
        try {
            User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                final String jwt = jwtUtils.generateToken(
                    new org.springframework.security.core.userdetails.User(
                        user.getEmail(), user.getPassword(), 
                        java.util.Collections.singletonList(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        )
                    ), 
                    user.getId(), 
                    user.getRole().name().toLowerCase()
                );
                
                return ResponseEntity.ok(new com.cdac.dto.JwtResponse(jwt, mapToDto(user)));
            } else {
                return ResponseEntity.status(401).body("Invalid password");
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token != null) {
                String email = jwtUtils.extractUsername(token);
                User user = userService.findUserByEmail(email);
                return ResponseEntity.ok(mapToDto(user));
            }
            return ResponseEntity.status(401).body(Map.of("error", "No valid token found"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private com.cdac.dto.UserResponseDto mapToDto(User user) {
        com.cdac.dto.UserResponseDto userDto = new com.cdac.dto.UserResponseDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setAddress(user.getAddress());
        userDto.setRole(user.getRole());

        if (user.getShopkeeper() != null) {
            userDto.setShopkeeperId(user.getShopkeeper().getId());
        }
        if (user.getVendor() != null) {
            userDto.setVendorId(user.getVendor().getId());
        }
        return userDto;
    }

    @GetMapping("/vendors")
    public ResponseEntity<?> getAllVendors() {
        try {
            return ResponseEntity.ok(userService.getAllVendors());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/shopkeepers")
    public ResponseEntity<?> getAllShopkeepers() {
        try {
            return ResponseEntity.ok(userService.getAllShopkeepers());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/vendors/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id) {
        try {
            userService.deleteVendor(id);
            return ResponseEntity.ok("Vendor deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/test-admin")
    public ResponseEntity<?> testAdmin() {
        try {
            User admin = userService.findUserByEmail("admin@b2b.com");
            return ResponseEntity.ok("Admin exists: " + admin.getName() + ", Role: " + admin.getRole());
        } catch (Exception e) {
            return ResponseEntity.ok("Admin not found: " + e.getMessage());
        }
    }

    @PostMapping("/test-password")
    public ResponseEntity<?> testPassword(@RequestBody UserLoginDto dto) {
        try {
            User user = userService.findUserByEmail(dto.getEmail());
            boolean matches = passwordEncoder.matches(dto.getPassword(), user.getPassword());
            return ResponseEntity.ok("User: " + user.getName() + ", Password matches: " + matches);
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password/{email}")
    public ResponseEntity<?> resetPassword(@PathVariable String email, @RequestParam String newPassword) {
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok("Password reset successfully. New hash: " + user.getPassword());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setName(request.getName());
            user.setPhone(request.getPhone());
            user.setAddress(request.getAddress());
            
            userRepository.save(user);
            return ResponseEntity.ok(mapToDto(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/test/{id}")
    public ResponseEntity<?> testEndpoint(@PathVariable Long id) {
        return ResponseEntity.ok("Test endpoint works for ID: " + id);
    }

    @DeleteMapping("/shopkeepers/{id}")
    public ResponseEntity<?> deleteShopkeeper(@PathVariable Long id) {
        try {
            userService.deleteShopkeeper(id);
            return ResponseEntity.ok("Shopkeeper deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
