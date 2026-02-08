package com.cdac.service;

import com.cdac.entity.Category;
import com.cdac.entity.SubCategory;
import com.cdac.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

@Service
@Order(2)
public class CategoryInitializationService implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            // Create sample categories
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Electronic devices and gadgets");
            electronics.setPhoto("https://via.placeholder.com/300x200/007bff/ffffff?text=Electronics");
            categoryRepository.save(electronics);

            Category fashion = new Category();
            fashion.setName("Fashion");
            fashion.setDescription("Clothing and accessories");
            fashion.setPhoto("https://via.placeholder.com/300x200/28a745/ffffff?text=Fashion");
            categoryRepository.save(fashion);

            Category home = new Category();
            home.setName("Home & Garden");
            home.setDescription("Home improvement and garden supplies");
            home.setPhoto("https://via.placeholder.com/300x200/ffc107/000000?text=Home+Garden");
            categoryRepository.save(home);

            System.out.println("✅ Sample categories created with placeholder images");
        }
    }
}