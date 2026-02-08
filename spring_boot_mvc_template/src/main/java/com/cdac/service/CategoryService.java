package com.cdac.service;

import com.cdac.entity.Category;
import com.cdac.entity.SubCategory;
import com.cdac.repository.CategoryRepository;
import com.cdac.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(com.cdac.dto.CategoryDto dto, org.springframework.web.multipart.MultipartFile photo) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = fileStorageService.store(photo);
            category.setPhoto(photoUrl);
        }
        
        try {
            return categoryRepository.save(category);
        } catch (Exception e) {
            // If DB save fails, cleanup the file
            if (photoUrl != null) {
                fileStorageService.delete(photoUrl);
            }
            throw e;
        }
    }

    public SubCategory createSubCategory(com.cdac.dto.SubCategoryDto dto, org.springframework.web.multipart.MultipartFile photo) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        SubCategory subCategory = new SubCategory();
        subCategory.setName(dto.getName());
        subCategory.setDescription(dto.getDescription());
        subCategory.setCategory(category);
        
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = fileStorageService.store(photo);
            subCategory.setPhoto(photoUrl);
        }
        
        try {
            return subCategoryRepository.save(subCategory);
        } catch (Exception e) {
             if (photoUrl != null) {
                fileStorageService.delete(photoUrl);
            }
            throw e;
        }
    }
    
    public List<SubCategory> getSubCategoriesByCategory(Long categoryId) {
        return subCategoryRepository.findByCategoryId(categoryId);
    }

    public List<SubCategory> getAllSubCategories() {
        return subCategoryRepository.findAll();
    }

    public Category updateCategory(Long id, com.cdac.dto.CategoryDto dto, org.springframework.web.multipart.MultipartFile photo) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Update basic fields
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        
        // Handle photo update
        if (photo != null && !photo.isEmpty()) {
            // Delete old photo if exists
            if (category.getPhoto() != null) {
                fileStorageService.delete(category.getPhoto());
            }
            // Store new photo
            String photoUrl = fileStorageService.store(photo);
            category.setPhoto(photoUrl);
        }
        
        return categoryRepository.save(category);
    }

    public SubCategory updateSubCategory(Long id, com.cdac.dto.SubCategoryDto dto, org.springframework.web.multipart.MultipartFile photo) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        
        // Update basic fields
        subCategory.setName(dto.getName());
        subCategory.setDescription(dto.getDescription());
        
        // Update category if changed
        if (dto.getCategoryId() != null && !dto.getCategoryId().equals(subCategory.getCategory().getId())) {
            Category newCategory = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            subCategory.setCategory(newCategory);
        }
        
        // Handle photo update
        if (photo != null && !photo.isEmpty()) {
            // Delete old photo if exists
            if (subCategory.getPhoto() != null) {
                fileStorageService.delete(subCategory.getPhoto());
            }
            // Store new photo
            String photoUrl = fileStorageService.store(photo);
            subCategory.setPhoto(photoUrl);
        }
        
        return subCategoryRepository.save(subCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Delete photo if exists
        if (category.getPhoto() != null) {
            fileStorageService.delete(category.getPhoto());
        }
        
        // Also delete photos of subcategories? 
        // Logic: if CascadeType.ALL is set, subcategories are deleted efficiently by DB.
        // But we need to delete their files manually because JPA won't trigger delete on subcategories individually in a way we intercept easily for file deletion unless we iterate.
        // For strict cleanup, we should iterate and delete files.
        for (SubCategory sub : category.getSubCategories()) {
            if (sub.getPhoto() != null) {
                fileStorageService.delete(sub.getPhoto());
            }
        }
        
        categoryRepository.deleteById(id);
    }

    public void deleteSubCategory(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        
        if (subCategory.getPhoto() != null) {
            fileStorageService.delete(subCategory.getPhoto());
        }
        
        subCategoryRepository.deleteById(id);
    }
}
