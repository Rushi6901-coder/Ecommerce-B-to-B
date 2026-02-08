package com.cdac.dto;

import lombok.Data;

@Data
public class ShopkeeperResponseDto {
    private Long id;
    private String shopName;
    private String shopAddress;
    private String licenseNumber;
    
    // User information
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String userAddress;
}
