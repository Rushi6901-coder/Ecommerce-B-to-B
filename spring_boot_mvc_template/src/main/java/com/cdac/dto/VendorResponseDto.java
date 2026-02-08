package com.cdac.dto;

import lombok.Data;

@Data
public class VendorResponseDto {
    private Long id;
    private String businessName;
    private String businessCategory;
    private String gstNumber;
    
    // User information
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String userAddress;
}
