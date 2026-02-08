package com.cdac.service;

import com.cdac.entity.Product;
import com.cdac.entity.SubCategory;
import com.cdac.entity.Vendor;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.SubCategoryRepository;
import com.cdac.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductInitializationService implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            initializeProducts();
        }
    }

    private void initializeProducts() {
        List<SubCategory> subCategories = subCategoryRepository.findAll();
        List<Vendor> vendors = vendorRepository.findAll();

        if (subCategories.isEmpty() || vendors.isEmpty()) {
            return; // Skip if no subcategories or vendors exist
        }

        // Sample products with placeholder images
        String[] productData = {
            "Smartphone|Latest Android smartphone with 128GB storage|25000|10|50|https://via.placeholder.com/300x300/007bff/ffffff?text=Smartphone",
            "Laptop|High-performance laptop for business use|65000|5|20|https://via.placeholder.com/300x300/28a745/ffffff?text=Laptop",
            "T-Shirt|Cotton casual t-shirt|500|15|100|https://via.placeholder.com/300x300/dc3545/ffffff?text=T-Shirt",
            "Jeans|Denim jeans for men|1200|20|75|https://via.placeholder.com/300x300/6f42c1/ffffff?text=Jeans",
            "Coffee Maker|Automatic coffee maker|8000|0|30|https://via.placeholder.com/300x300/fd7e14/ffffff?text=Coffee+Maker",
            "Microwave|Digital microwave oven|12000|8|25|https://via.placeholder.com/300x300/20c997/ffffff?text=Microwave",
            "Running Shoes|Comfortable running shoes|3500|12|60|https://via.placeholder.com/300x300/e83e8c/ffffff?text=Shoes",
            "Yoga Mat|Non-slip yoga mat|800|0|40|https://via.placeholder.com/300x300/6610f2/ffffff?text=Yoga+Mat"
        };

        for (int i = 0; i < productData.length && i < subCategories.size(); i++) {
            String[] parts = productData[i].split("\\|");
            if (parts.length == 6) {
                Product product = new Product();
                product.setName(parts[0]);
                product.setDescription(parts[1]);
                product.setPrice(new BigDecimal(parts[2]));
                product.setDiscount(Integer.parseInt(parts[3]));
                product.setStockQuantity(Integer.parseInt(parts[4]));
                product.setImageUrl(parts[5]);
                product.setSubCategory(subCategories.get(i % subCategories.size()));
                product.setVendor(vendors.get(i % vendors.size()));

                productRepository.save(product);
            }
        }

        System.out.println("Sample products initialized with placeholder images");
    }
}