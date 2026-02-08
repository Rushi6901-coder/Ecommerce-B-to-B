package com.cdac.service;

import com.cdac.entity.Cart;
import com.cdac.entity.Product;
import com.cdac.entity.Shopkeeper;
import com.cdac.repository.CartRepository;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.ShopkeeperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopkeeperRepository shopkeeperRepository;

    @Transactional
    public void addToCart(Long shopkeeperId, Long productId, Integer quantity) {
        Shopkeeper shopkeeper = shopkeeperRepository.findById(shopkeeperId)
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if product already in cart
        Optional<Cart> existingCart = cartRepository.findByShopkeeperIdAndProductId(shopkeeperId, productId);
        
        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + quantity);
            cartRepository.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setShopkeeper(shopkeeper);
            cart.setProduct(product);
            cart.setQuantity(quantity);
            cartRepository.save(cart);
        }
    }

    public List<Cart> getCartItems(Long shopkeeperId) {
        return cartRepository.findByShopkeeperId(shopkeeperId);
    }

    @Transactional
    public void clearCart(Long shopkeeperId) {
        cartRepository.deleteByShopkeeperId(shopkeeperId);
    }
}