package com.cdac.dto;

import lombok.Data;

@Data
public class ShopkeeperUpdateRequest {
    private String shopName;
    private String shopAddress;
    private String licenseNumber;
}