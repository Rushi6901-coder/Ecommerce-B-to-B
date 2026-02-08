import api from './api';
import { API_ENDPOINTS } from '../config/api';

const categoryService = {
    // Get all categories with subcategories (Public)
    getAllCategories: async () => {
        try {
            const response = await api.get(`${API_ENDPOINTS.publicCategories || '/categories'}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get single category by ID (Admin)
    getCategoryById: async (id) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.categories}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // Create category (Admin)
    createCategory: async (categoryData) => {
        try {
            const response = await api.post(API_ENDPOINTS.categories, {
                categoryName: categoryData.categoryName,
                photoLink: categoryData.photoLink || null,
                isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
            });
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    // Update category (Admin)
    updateCategory: async (id, categoryData) => {
        try {
            const response = await api.put(`${API_ENDPOINTS.categories}/${id}`, {
                categoryName: categoryData.categoryName,
                photoLink: categoryData.photoLink || null,
                isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
            });
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    // Delete category (Admin - soft delete)
    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`${API_ENDPOINTS.categories}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};

export default categoryService;
