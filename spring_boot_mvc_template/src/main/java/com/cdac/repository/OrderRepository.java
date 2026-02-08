package com.cdac.repository;

import com.cdac.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByShopkeeperId(Long shopkeeperId);
    List<Order> findByVendorId(Long vendorId);

    // Dashboard Stats
    Long countByVendorId(Long vendorId);
    
    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.vendor.id = :vendorId")
    java.math.BigDecimal sumTotalAmountByVendorId(@org.springframework.data.repository.query.Param("vendorId") Long vendorId);

    Long countByVendorIdAndStatus(Long vendorId, String status);

    // Shopkeeper Dashboard Stats
    Long countByShopkeeperId(Long shopkeeperId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.shopkeeper.id = :shopkeeperId")
    java.math.BigDecimal sumTotalAmountByShopkeeperId(@org.springframework.data.repository.query.Param("shopkeeperId") Long shopkeeperId);

    Long countByShopkeeperIdAndStatus(Long shopkeeperId, String status);
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByVendorId(Long vendorId);
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByShopkeeperId(Long shopkeeperId);
}
