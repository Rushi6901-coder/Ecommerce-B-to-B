import api from './api';

// Order Services
export const orderService = {
    // Place a direct order (shopkeeper)
    placeOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get orders for a specific shopkeeper
    getShopkeeperOrders: async (shopkeeperId) => {
        const response = await api.get(`/orders/shopkeeper/${shopkeeperId}`);
        return response.data;
    },

    // Get orders for a specific vendor
    getVendorOrders: async (vendorId) => {
        const response = await api.get(`/orders/vendor/${vendorId}`);
        return response.data;
    },

    // Update order status (vendor only)
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    },

    // Get details of a specific order
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    // Get all orders (admin only)
    getAllOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    }
};

export default orderService;
