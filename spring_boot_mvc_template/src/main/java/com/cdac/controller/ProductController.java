package com.cdac.controller;

import com.cdac.entity.Product;
import com.cdac.service.ProductService;
import com.cdac.dto.ProductUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "discount", defaultValue = "0") int discount,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam("subCategoryId") Long subCategoryId,
            @RequestParam("vendorId") Long vendorId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        return productService.addProduct(name, description, price, discount, stockQuantity, subCategoryId, vendorId, image);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public Product updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "discount", defaultValue = "0") int discount,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam("subCategoryId") Long subCategoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        return productService.updateProduct(id, name, description, price, 
                discount, stockQuantity, subCategoryId, image);
    }

    @GetMapping("/vendor/{vendorId}")
    public List<Product> getProductsByVendor(@PathVariable Long vendorId) {
        return productService.getProductsByVendor(vendorId);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/subcategory/{subCategoryId}")
    public List<Product> getProductsBySubCategory(@PathVariable Long subCategoryId) {
        return productService.getProductsBySubCategory(subCategoryId);
    }

    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}
