package com.cdac.dto;

import lombok.Data;

@Data
public class VendorDto {
    private Long userId;
    private String businessName;
    private String businessCategory;
    private String gstNumber;
}
