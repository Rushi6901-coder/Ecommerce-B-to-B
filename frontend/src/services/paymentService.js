import api from './api';

export const paymentService = {
    // Create Razorpay Order
    createRazorpayOrder: async (amount) => {
        const response = await api.post('/payment/create-order', { amount });
        return response.data;
    },

    // Verify Payment and Update Backend Order
    verifyPayment: async (paymentData) => {
        const response = await api.post('/payment/verify', paymentData);
        return response.data;
    }
};

export default paymentService;
