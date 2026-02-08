import api from './api';

// User Management Services (mostly for admin)
export const userService = {
    // Get all vendors
    getAllVendors: async () => {
        const response = await api.get('/users/vendors');
        return response.data;
    },

    // Get all shopkeepers
    getAllShopkeepers: async () => {
        const response = await api.get('/users/shopkeepers');
        return response.data;
    },

    // Delete vendor (admin only)
    deleteVendor: async (id) => {
        const response = await api.delete(`/users/vendors/${id}`);
        return response.data;
    },

    // Delete shopkeeper (admin only)
    deleteShopkeeper: async (id) => {
        const response = await api.delete(`/users/shopkeepers/${id}`);
        return response.data;
    },

    // Get current user details
    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data;
    }
};

export default userService;
