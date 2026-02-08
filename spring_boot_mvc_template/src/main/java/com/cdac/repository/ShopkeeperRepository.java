package com.cdac.repository;

import com.cdac.entity.Shopkeeper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopkeeperRepository extends JpaRepository<Shopkeeper, Long> {
    Shopkeeper findByUserId(Long userId);
}
