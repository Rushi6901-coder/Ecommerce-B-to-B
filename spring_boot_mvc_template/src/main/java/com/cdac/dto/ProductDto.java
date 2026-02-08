package com.cdac.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private String imageUrl;
    private Long subCategoryId;
    private Long vendorId;
}
