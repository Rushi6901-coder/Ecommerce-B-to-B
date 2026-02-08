import api from './api';

// Authentication Services
export const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    // Register vendor details
    registerVendor: async (vendorData) => {
        const response = await api.post('/users/vendor-register', vendorData);
        return response.data;
    },

    // Register shopkeeper details
    registerShopkeeper: async (shopkeeperData) => {
        const response = await api.post('/users/shopkeeper-register', shopkeeperData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        if (response.data.token) {
            localStorage.setItem('b2b_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('b2b_token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('b2b_token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('b2b_token');
    }
};

export default authService;
