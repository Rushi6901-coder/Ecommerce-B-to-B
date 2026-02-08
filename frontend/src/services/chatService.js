import api from './api';

// Chat Services
export const chatService = {
    // Create or get existing chat room
    createChatRoom: async (vendorId, shopkeeperId) => {
        const response = await api.post('/chat/room', null, {
            params: { vendorId, shopkeeperId }
        });
        return response.data;
    },

    // Get all chat rooms for a vendor
    getVendorRooms: async (vendorId) => {
        const response = await api.get(`/chat/active-rooms/vendor/${vendorId}`);
        return response.data;
    },

    // Get all chat rooms for a shopkeeper
    getShopkeeperRooms: async (shopkeeperId) => {
        const response = await api.get(`/chat/active-rooms/shopkeeper/${shopkeeperId}`);
        return response.data;
    },

    // Send a text message
    sendMessage: async (messageData) => {
        const response = await api.post('/chat/message', messageData);
        return response.data;
    },

    // Get all messages in a chat room
    getMessages: async (roomId) => {
        const response = await api.get(`/chat/room/${roomId}/messages`);
        return response.data;
    },

    // Send estimation (vendor creates order through chat)
    sendEstimation: async (chatRoomId, senderId, orderData) => {
        const response = await api.post('/chat/estimation', orderData, {
            params: { chatRoomId, senderId }
        });
        return response.data;
    },

    // Send invoice (vendor confirms order through chat)
    sendInvoice: async (chatRoomId, senderId, orderId, invoiceContent) => {
        const response = await api.post('/chat/invoice', invoiceContent, {
            params: { chatRoomId, senderId, orderId },
            headers: { 'Content-Type': 'text/plain' }
        });
        return response.data;
    }
};

export default chatService;
