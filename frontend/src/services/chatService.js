const API_BASE = 'http://localhost:5226/api/chat';

export const chatService = {
  sendTextMessage: async (messageData) => {
    const response = await fetch(`${API_BASE}/send-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },

  sendInvoice: async (invoiceData) => {
    const response = await fetch(`${API_BASE}/send-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send invoice');
    }
    
    return response.json();
  },

  getMessages: async (chatRoomId) => {
    const response = await fetch(`${API_BASE}/${chatRoomId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get messages');
    }
    
    return response.json();
  }
};