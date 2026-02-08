package com.cdac.dto;

import lombok.Data;

@Data
public class ShopkeeperDto {
    private Long userId;
    private String shopName;
    private String shopAddress;
    private String licenseNumber;
}
