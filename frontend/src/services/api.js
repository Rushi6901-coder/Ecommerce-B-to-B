import axios from 'axios';

const API_BASE_URL = 'https://localhost:5001/api'; // Backend port

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

export default api;
