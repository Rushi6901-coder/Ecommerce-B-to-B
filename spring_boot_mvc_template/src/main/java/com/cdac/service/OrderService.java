package com.cdac.service;

import com.cdac.dto.OrderItemDto;
import com.cdac.dto.OrderRequestDto;
import com.cdac.entity.*;
import com.cdac.repository.OrderRepository;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.ShopkeeperRepository;
import com.cdac.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ShopkeeperRepository shopkeeperRepository;

    @Autowired
    private CartService cartService;

    @Transactional
    public Order createDirectOrder(Long shopkeeperId) {
        List<com.cdac.entity.Cart> cartItems = cartService.getCartItems(shopkeeperId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Shopkeeper shopkeeper = shopkeeperRepository.findById(shopkeeperId)
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
        
        // Get vendor from first cart item (assuming single vendor per cart)
        Vendor vendor = cartItems.get(0).getProduct().getVendor();

        Order order = new Order();
        order.setShopkeeper(shopkeeper);
        order.setVendor(vendor);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderType(OrderType.DIRECT);
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (com.cdac.entity.Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(shopkeeperId);
        
        return savedOrder;
    }

    public String createEstimationRequest(Long shopkeeperId) {
        List<com.cdac.entity.Cart> cartItems = cartService.getCartItems(shopkeeperId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Get vendor from first cart item
        Vendor vendor = cartItems.get(0).getProduct().getVendor();
        
        // Create or get chat room and redirect to chat
        return "Chat initiated with vendor: " + vendor.getShopName();
    }
    public Order placeOrder(OrderRequestDto dto) {
        Shopkeeper shopkeeper = shopkeeperRepository.findById(dto.getShopkeeperId())
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
        Vendor vendor = vendorRepository.findById(dto.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Order order = new Order();
        order.setShopkeeper(shopkeeper);
        order.setVendor(vendor);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderType(OrderType.DIRECT);
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemDto itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Check stock? Assuming yes but simplistic
            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByShopkeeper(Long shopkeeperId) {
        return orderRepository.findByShopkeeperId(shopkeeperId);
    }

    public List<Order> getOrdersByVendor(Long vendorId) {
        return orderRepository.findByVendorId(vendorId);
    }
    
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public BigDecimal getTotalExpense(Long shopkeeperId) {
        List<Order> orders = orderRepository.findByShopkeeperId(shopkeeperId);
        return orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
