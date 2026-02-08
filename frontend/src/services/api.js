import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'; // Backend port

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 400) {
            console.error('Validation Errors:', error.response.data.errors);
        }
        return Promise.reject(error);
    }
);

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('b2b_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
