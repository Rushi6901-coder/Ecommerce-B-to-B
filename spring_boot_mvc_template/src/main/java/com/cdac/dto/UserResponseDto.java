package com.cdac.dto;

import com.cdac.entity.Role;
import lombok.Data;

@Data
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Role role;
    
    // Flattened role-specific IDs if needed
    private Long shopkeeperId;
    private Long vendorId;
    
    // Optional: Include role specific objects mapped to DTOs if complex data needed
    // But for login, usually just the ID or basic info is enough.
}
