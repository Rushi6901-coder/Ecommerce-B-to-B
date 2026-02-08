package com.cdac.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductUpdateRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer discount;
    private Integer stockQuantity;
    private Long subCategoryId;
}