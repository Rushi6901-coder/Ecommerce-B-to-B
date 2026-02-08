package com.cdac.repository;

import com.cdac.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySubCategoryId(Long subCategoryId);
    List<Product> findByVendorId(Long vendorId);
    List<Product> findBySubCategoryCategoryId(Long categoryId);
    List<Product> findTop10ByOrderByIdDesc();
    
    Long countByVendorId(Long vendorId);
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByVendorId(Long vendorId);
}
