package com.cdac.service;

import com.cdac.dto.UserLoginDto;
import com.cdac.dto.UserRegistrationDto;
import com.cdac.entity.Role;
import com.cdac.entity.Shopkeeper;
import com.cdac.entity.User;
import com.cdac.entity.Vendor;
import com.cdac.repository.ShopkeeperRepository;
import com.cdac.repository.UserRepository;
import com.cdac.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ShopkeeperRepository shopkeeperRepository;
    
    @Autowired
    private com.cdac.repository.ProductRepository productRepository;
    
    @Autowired
    private com.cdac.repository.OrderRepository orderRepository;
    
    @Autowired
    private com.cdac.repository.ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private com.cdac.repository.MessageRepository messageRepository;
    
    @Autowired
    private com.cdac.repository.CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // Encrypt password
        user.setRole(dto.getRole());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        return userRepository.save(user);
    }

    public void registerVendor(com.cdac.dto.VendorDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != Role.VENDOR) {
            throw new RuntimeException("User is not a Vendor");
        }

        Vendor vendor = new Vendor();
        vendor.setUser(user);
        vendor.setShopName(dto.getBusinessName());
        vendor.setBusinessCategory(dto.getBusinessCategory());
        vendor.setGstNumber(dto.getGstNumber());
        
        vendorRepository.save(vendor);
    }

    public void registerShopkeeper(com.cdac.dto.ShopkeeperDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.SHOPKEEPER) {
            throw new RuntimeException("User is not a Shopkeeper");
        }

        Shopkeeper shopkeeper = new Shopkeeper();
        shopkeeper.setUser(user);
        shopkeeper.setShopName(dto.getShopName());
        shopkeeper.setShopAddress(dto.getShopAddress() != null ? dto.getShopAddress() : user.getAddress());
        shopkeeper.setLicenseNumber(dto.getLicenseNumber());
        
        shopkeeperRepository.save(shopkeeper);
    }

    public User loginUser(UserLoginDto dto) {
        Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                return user;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public java.util.List<com.cdac.dto.VendorResponseDto> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(this::mapVendorToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<com.cdac.dto.ShopkeeperResponseDto> getAllShopkeepers() {
        return shopkeeperRepository.findAll().stream()
                .map(this::mapShopkeeperToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    private com.cdac.dto.VendorResponseDto mapVendorToDto(Vendor vendor) {
        com.cdac.dto.VendorResponseDto dto = new com.cdac.dto.VendorResponseDto();
        dto.setId(vendor.getId());
        dto.setBusinessName(vendor.getShopName());
        dto.setBusinessCategory(vendor.getBusinessCategory());
        dto.setGstNumber(vendor.getGstNumber());
        
        // Map user info
        User user = vendor.getUser();
        dto.setUserId(user.getId());
        dto.setUserName(user.getName());
        dto.setUserEmail(user.getEmail());
        dto.setUserPhone(user.getPhone());
        dto.setUserAddress(user.getAddress());
        
        return dto;
    }

    private com.cdac.dto.ShopkeeperResponseDto mapShopkeeperToDto(Shopkeeper shopkeeper) {
        com.cdac.dto.ShopkeeperResponseDto dto = new com.cdac.dto.ShopkeeperResponseDto();
        dto.setId(shopkeeper.getId());
        dto.setShopName(shopkeeper.getShopName());
        dto.setShopAddress(shopkeeper.getShopAddress());
        dto.setLicenseNumber(shopkeeper.getLicenseNumber());
        
        // Map user info
        User user = shopkeeper.getUser();
        dto.setUserId(user.getId());
        dto.setUserName(user.getName());
        dto.setUserEmail(user.getEmail());
        dto.setUserPhone(user.getPhone());
        dto.setUserAddress(user.getAddress());
        
        return dto;
    }

    @Transactional
    public void deleteVendor(Long id) {
        System.out.println("Deleting Vendor: " + id);
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        // 1. Delete Carts (Dependency on Products)
        cartRepository.deleteByProductVendorId(id);
        
        // 2. Chat Rooms & Messages
        java.util.List<com.cdac.entity.ChatRoom> chatRooms = chatRoomRepository.findByVendorId(id);
        for (com.cdac.entity.ChatRoom room : chatRooms) {
            messageRepository.deleteByChatRoomId(room.getId());
        }
        chatRoomRepository.deleteAll(chatRooms);
        
        // 3. Delete Orders
        orderRepository.deleteByVendorId(id);
        
        // 4. Delete Products
        productRepository.deleteByVendorId(id);
        
        // 5. Update User to remove reference (Triggers orphanRemoval or at least decouples)
        User user = vendor.getUser();
        if (user != null) {
            user.setVendor(null);
            userRepository.save(user); // This should trigger delete of Vendor due to orphanRemoval=true
        } else {
            // Fallback if data corruption
            vendorRepository.delete(vendor);
        }
        
        System.out.println("Vendor deleted successfully");
    }

    @Transactional
    public void deleteShopkeeper(Long id) {
        System.out.println("Deleting Shopkeeper: " + id);
        Shopkeeper shopkeeper = shopkeeperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
        
        // 1. Empty Cart
        cartRepository.deleteByShopkeeperId(id);
        
        // 2. Chat Rooms & Messages
        java.util.List<com.cdac.entity.ChatRoom> chatRooms = chatRoomRepository.findByShopkeeperId(id);
        for (com.cdac.entity.ChatRoom room : chatRooms) {
            messageRepository.deleteByChatRoomId(room.getId());
        }
        chatRoomRepository.deleteAll(chatRooms);
        
        // 3. Delete Orders
        orderRepository.deleteByShopkeeperId(id);
        
        // 4. Update User to remove reference
        User user = shopkeeper.getUser();
        if (user != null) {
            user.setShopkeeper(null);
            userRepository.save(user); // Triggers orphanRemoval
        } else {
            shopkeeperRepository.delete(shopkeeper);
        }
        
        System.out.println("Shopkeeper deleted successfully");
    }
}
