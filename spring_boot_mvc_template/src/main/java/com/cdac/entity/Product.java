package com.cdac.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(nullable = false)
    private int discount = 0; // Discount percentage (0-100)

    private int stockQuantity;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "sub_category_id", nullable = false)
    private SubCategory subCategory;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;
}
