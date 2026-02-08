package com.cdac.repository;

import com.cdac.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByShopkeeperId(Long shopkeeperId);
    Optional<Cart> findByShopkeeperIdAndProductId(Long shopkeeperId, Long productId);
    
    @Modifying
    @Transactional
    void deleteByShopkeeperId(Long shopkeeperId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Cart c WHERE c.product.vendor.id = :vendorId")
    void deleteByProductVendorId(@Param("vendorId") Long vendorId);
}