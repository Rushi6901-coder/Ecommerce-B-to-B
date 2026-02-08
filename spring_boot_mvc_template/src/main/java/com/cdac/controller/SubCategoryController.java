package com.cdac.controller;

import com.cdac.entity.SubCategory;
import com.cdac.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<SubCategory> getAllSubCategories() {
        return categoryService.getAllSubCategories();
    }

    @GetMapping("/category/{categoryId}")
    public List<SubCategory> getSubCategoriesByCategory(@PathVariable Long categoryId) {
        return categoryService.getSubCategoriesByCategory(categoryId);
    }
}