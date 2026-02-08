package com.cdac.dto;

import lombok.Data;

@Data
public class SubCategoryDto {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
}
