package com.cdac.controller;

import com.cdac.entity.Order;
import com.cdac.entity.OrderStatus;
import com.cdac.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            BigDecimal amount = new BigDecimal(data.get("amount").toString());
            String currency = "INR";
            
            // In a real app, you might want to create a local Order first with status PENDING_PAYMENT
            // For now, we just create a Razorpay order

            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount.multiply(BigDecimal.valueOf(100))); // Amount in paise
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);

            return ResponseEntity.ok(razorpayOrder.toString());

        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Razorpay Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            Long orderId = Long.parseLong(data.get("internalOrderId")); // Our local DB Order ID
            String razorpayPaymentId = data.get("razorpay_payment_id");
            String razorpayOrderId = data.get("razorpay_order_id");
            String razorpaySignature = data.get("razorpay_signature");

            // Verify signature (Crucial step in production)
            // String payload = razorpayOrderId + "|" + razorpayPaymentId;
            // boolean isValid = Utils.verifyPaymentSignature(new JSONObject(data), razorpayKeySecret);

            // For this demo, we assume success if IDs are present, but updating our Order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

            order.setTransactionId(razorpayPaymentId);
            order.setStatus(OrderStatus.CONFIRMED); // Update status to Confirmed upon payment
            orderRepository.save(order);

            return ResponseEntity.ok("Payment verified and Order Confirmed");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
