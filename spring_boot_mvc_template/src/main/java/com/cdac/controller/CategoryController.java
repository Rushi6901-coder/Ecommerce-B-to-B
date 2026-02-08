package com.cdac.controller;

import com.cdac.entity.Category;
import com.cdac.entity.SubCategory;
import com.cdac.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Category createCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "photo", required = false) org.springframework.web.multipart.MultipartFile photo) {
        
        com.cdac.dto.CategoryDto dto = new com.cdac.dto.CategoryDto();
        dto.setName(name);
        dto.setDescription(description);
        
        return categoryService.createCategory(dto, photo);
    }

    @PostMapping(value = "/sub", consumes = {"multipart/form-data"})
    public SubCategory createSubCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "photo", required = false) org.springframework.web.multipart.MultipartFile photo) {
        
        com.cdac.dto.SubCategoryDto dto = new com.cdac.dto.SubCategoryDto();
        dto.setName(name);
        dto.setDescription(description);
        dto.setCategoryId(categoryId);
        
        return categoryService.createSubCategory(dto, photo);
    }
    
    @GetMapping("/{id}/sub")
    public List<SubCategory> getSubCategoriesByCategory(@PathVariable Long id) {
        return categoryService.getSubCategoriesByCategory(id);
    }

    @GetMapping("/sub")
    public List<SubCategory> getAllSubCategories() {
        return categoryService.getAllSubCategories();
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public Category updateCategory(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "photo", required = false) org.springframework.web.multipart.MultipartFile photo) {
        
        com.cdac.dto.CategoryDto dto = new com.cdac.dto.CategoryDto();
        dto.setName(name);
        dto.setDescription(description);
        
        return categoryService.updateCategory(id, dto, photo);
    }

    @PutMapping(value = "/sub/{id}", consumes = {"multipart/form-data"})
    public SubCategory updateSubCategory(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "photo", required = false) org.springframework.web.multipart.MultipartFile photo) {
        
        com.cdac.dto.SubCategoryDto dto = new com.cdac.dto.SubCategoryDto();
        dto.setName(name);
        dto.setDescription(description);
        dto.setCategoryId(categoryId);
        
        return categoryService.updateSubCategory(id, dto, photo);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }

    @DeleteMapping("/sub/{id}")
    public void deleteSubCategory(@PathVariable Long id) {
        categoryService.deleteSubCategory(id);
    }
}
