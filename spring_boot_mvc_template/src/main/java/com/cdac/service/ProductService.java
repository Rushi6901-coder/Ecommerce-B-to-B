package com.cdac.service;

import com.cdac.entity.Product;
import com.cdac.entity.SubCategory;
import com.cdac.entity.Vendor;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.SubCategoryRepository;
import com.cdac.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private VendorRepository vendorRepository;

    private final String uploadDir = "uploads/products/";

    public Product addProduct(String name, String description, BigDecimal price, int discount, 
                             int stockQuantity, Long subCategoryId, Long vendorId, MultipartFile image) {
        SubCategory subCategory = subCategoryRepository.findById(subCategoryId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setDiscount(discount);
        product.setStockQuantity(stockQuantity);
        product.setSubCategory(subCategory);
        product.setVendor(vendor);

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            product.setImageUrl(imagePath);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, String name, String description, BigDecimal price, 
                                int discount, int stockQuantity, Long subCategoryId, MultipartFile image) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        SubCategory subCategory = subCategoryRepository.findById(subCategoryId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setDiscount(discount);
        product.setStockQuantity(stockQuantity);
        product.setSubCategory(subCategory);

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            if (product.getImageUrl() != null) {
                deleteImage(product.getImageUrl());
            }
            String imagePath = saveImage(image);
            product.setImageUrl(imagePath);
        }

        return productRepository.save(product);
    }

    private String saveImage(MultipartFile file) {
        try {
            // Create directory if not exists
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = Paths.get(uploadDir + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/products/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }

    private void deleteImage(String imagePath) {
        try {
            if (imagePath != null && imagePath.startsWith("/uploads/")) {
                Path path = Paths.get(imagePath.substring(1)); // Remove leading /
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            // Log error but don't fail the operation
            System.err.println("Failed to delete image: " + e.getMessage());
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByVendor(Long vendorId) {
        return productRepository.findByVendorId(vendorId);
    }

    public List<Product> getProductsBySubCategory(Long subCategoryId) {
        return productRepository.findBySubCategoryId(subCategoryId);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findBySubCategoryCategoryId(categoryId);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findTop10ByOrderByIdDesc();
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Delete image file if exists
        if (product.getImageUrl() != null) {
            deleteImage(product.getImageUrl());
        }
        
        productRepository.deleteById(id);
    }
}
