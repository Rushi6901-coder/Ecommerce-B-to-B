import api from './api';

// Admin Services
export const adminService = {
    // Get all orders (admin view)
    getAllOrders: async () => {
        const response = await api.get('/admin/orders');
        return response.data;
    },

    // Get dashboard statistics
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    }
};

export default adminService;
