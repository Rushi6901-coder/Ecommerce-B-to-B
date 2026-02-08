package com.cdac.service;

import com.cdac.repository.OrderRepository;
import com.cdac.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class VendorDashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Long getTotalProducts(Long vendorId) {
        return productRepository.countByVendorId(vendorId);
    }

    public BigDecimal getTotalIncome(Long vendorId) {
        BigDecimal income = orderRepository.sumTotalAmountByVendorId(vendorId);
        return income != null ? income : BigDecimal.ZERO;
    }

    public Long getTotalOrders(Long vendorId) {
        return orderRepository.countByVendorId(vendorId);
    }

    public Map<String, Long> getOrderStatusCounts(Long vendorId) {
        Map<String, Long> statusCounts = new HashMap<>();
        // Assuming statuses: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
        String[] statuses = {"PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"};
        
        for (String status : statuses) {
            Long count = orderRepository.countByVendorIdAndStatus(vendorId, status);
            statusCounts.put(status, count);
        }
        return statusCounts;
    }
}
