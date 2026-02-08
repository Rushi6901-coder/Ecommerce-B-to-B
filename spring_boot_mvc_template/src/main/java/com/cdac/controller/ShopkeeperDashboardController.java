package com.cdac.controller;

import com.cdac.service.ShopkeeperDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/shopkeeper-dashboard")
public class ShopkeeperDashboardController {

    @Autowired
    private ShopkeeperDashboardService dashboardService;

    @GetMapping("/{shopkeeperId}/total-spend")
    public BigDecimal getTotalSpend(@PathVariable Long shopkeeperId) {
        return dashboardService.getTotalSpend(shopkeeperId);
    }

    @GetMapping("/{shopkeeperId}/total-orders")
    public Long getTotalOrders(@PathVariable Long shopkeeperId) {
        return dashboardService.getTotalOrders(shopkeeperId);
    }

    @GetMapping("/{shopkeeperId}/order-status-counts")
    public Map<String, Long> getOrderStatusCounts(@PathVariable Long shopkeeperId) {
        return dashboardService.getOrderStatusCounts(shopkeeperId);
    }
}
