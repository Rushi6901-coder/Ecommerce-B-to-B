import api from './api';
import { API_ENDPOINTS } from '../config/api';

const subcategoryService = {
    // Get all subcategories (Admin)
    getAllSubCategories: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.subcategories);
            return response.data;
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            throw error;
        }
    },

    // Get single subcategory by ID (Admin)
    getSubCategoryById: async (id) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.subcategories}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subcategory:', error);
            throw error;
        }
    },

    // Create subcategory (Admin)
    createSubCategory: async (subcategoryData) => {
        try {
            const response = await api.post(API_ENDPOINTS.subcategories, {
                categoryId: subcategoryData.categoryId,
                subCategoryName: subcategoryData.subCategoryName,
                photoLink: subcategoryData.photoLink || null,
                isActive: subcategoryData.isActive !== undefined ? subcategoryData.isActive : true
            });
            return response.data;
        } catch (error) {
            console.error('Error creating subcategory:', error);
            throw error;
        }
    },

    // Update subcategory (Admin)
    updateSubCategory: async (id, subcategoryData) => {
        try {
            const response = await api.put(`${API_ENDPOINTS.subcategories}/${id}`, {
                categoryId: subcategoryData.categoryId,
                subCategoryName: subcategoryData.subCategoryName,
                photoLink: subcategoryData.photoLink || null,
                isActive: subcategoryData.isActive !== undefined ? subcategoryData.isActive : true
            });
            return response.data;
        } catch (error) {
            console.error('Error updating subcategory:', error);
            throw error;
        }
    },

    // Delete subcategory (Admin - soft delete)
    deleteSubCategory: async (id) => {
        try {
            const response = await api.delete(`${API_ENDPOINTS.subcategories}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            throw error;
        }
    }
};

export default subcategoryService;
