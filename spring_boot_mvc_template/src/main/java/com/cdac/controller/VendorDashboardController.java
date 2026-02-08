package com.cdac.controller;

import com.cdac.service.VendorDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/vendor-dashboard")
public class VendorDashboardController {

    @Autowired
    private VendorDashboardService dashboardService;

    @GetMapping("/{vendorId}/total-products")
    public Long getTotalProducts(@PathVariable Long vendorId) {
        return dashboardService.getTotalProducts(vendorId);
    }

    @GetMapping("/{vendorId}/total-income")
    public BigDecimal getTotalIncome(@PathVariable Long vendorId) {
        return dashboardService.getTotalIncome(vendorId);
    }

    @GetMapping("/{vendorId}/total-orders")
    public Long getTotalOrders(@PathVariable Long vendorId) {
        return dashboardService.getTotalOrders(vendorId);
    }

    @GetMapping("/{vendorId}/order-status-counts")
    public Map<String, Long> getOrderStatusCounts(@PathVariable Long vendorId) {
        return dashboardService.getOrderStatusCounts(vendorId);
    }
}
