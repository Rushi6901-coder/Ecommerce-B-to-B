import api from './api';
import { API_ENDPOINTS } from '../config/api';

const productService = {
    // Get all products (Public)
    getAllProducts: async () => {
        try {
            const response = await api.get(`${API_ENDPOINTS.publicProducts || '/products'}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Get products by category (Public)
    getProductsByCategory: async (categoryId) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.publicCategoryProducts || '/products/category'}/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    // Get products by subcategory (Public)
    getProductsBySubCategory: async (subCategoryId) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.publicSubCategoryProducts || '/products/subcategory'}/${subCategoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by subcategory:', error);
            throw error;
        }
    },

    // Get single product by ID (Public)
    getProductById: async (id) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.publicProducts || '/products'}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Search products (Public)
    searchProducts: async (query) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.publicSearch || '/products/search'}?query=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    // Get vendor products (Vendor)
    getVendorProducts: async (vendorId) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.vendorProducts}/${vendorId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vendor products:', error);
            throw error;
        }
    },

    // Create product (Vendor)
    createProduct: async (productData) => {
        try {
            const response = await api.post(API_ENDPOINTS.vendorProducts, {
                productName: productData.productName,
                description: productData.description || null,
                photoLink: productData.photoLink || null,
                price: productData.price,
                discount: productData.discount || 0,
                minimumQuantity: productData.minimumQuantity || 1,
                stock: productData.stock,
                vendorId: productData.vendorId,
                categoryId: productData.categoryId,
                subCategoryId: productData.subCategoryId
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Update product (Vendor)
    updateProduct: async (id, productData) => {
        try {
            const response = await api.put(`${API_ENDPOINTS.vendorProducts}/${id}`, {
                productName: productData.productName,
                description: productData.description || null,
                photoLink: productData.photoLink || null,
                price: productData.price,
                discount: productData.discount || 0,
                minimumQuantity: productData.minimumQuantity || 1,
                stock: productData.stock,
                vendorId: productData.vendorId,
                categoryId: productData.categoryId,
                subCategoryId: productData.subCategoryId
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Delete product (Vendor)
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`${API_ENDPOINTS.vendorProducts}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};

export default productService;
