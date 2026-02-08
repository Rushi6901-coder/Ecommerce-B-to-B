package com.cdac.dto;

import lombok.Data;

@Data
public class VendorUpdateRequest {
    private String businessName;
    private String businessCategory;
    private String gstNumber;
}