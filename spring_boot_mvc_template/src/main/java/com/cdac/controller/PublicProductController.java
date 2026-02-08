package com.cdac.controller;

import com.cdac.service.ProductService;
import com.cdac.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/public")
public class PublicProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/subcategory/{subCategoryId}")
    public ResponseEntity<?> getProductsBySubCategory(@PathVariable Long subCategoryId) {
        return ResponseEntity.ok(productService.getProductsBySubCategory(subCategoryId));
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }
}