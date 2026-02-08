package com.cdac.service;

import com.cdac.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class ShopkeeperDashboardService {

    @Autowired
    private OrderRepository orderRepository;

    public BigDecimal getTotalSpend(Long shopkeeperId) {
        BigDecimal spend = orderRepository.sumTotalAmountByShopkeeperId(shopkeeperId);
        return spend != null ? spend : BigDecimal.ZERO;
    }

    public Long getTotalOrders(Long shopkeeperId) {
        return orderRepository.countByShopkeeperId(shopkeeperId);
    }

    public Map<String, Long> getOrderStatusCounts(Long shopkeeperId) {
        Map<String, Long> statusCounts = new HashMap<>();
        // Assuming statuses: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
        String[] statuses = {"PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"};
        
        for (String status : statuses) {
            Long count = orderRepository.countByShopkeeperIdAndStatus(shopkeeperId, status);
            statusCounts.put(status, count);
        }
        return statusCounts;
    }
}
