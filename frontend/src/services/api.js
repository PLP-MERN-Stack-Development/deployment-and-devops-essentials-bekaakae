import axios from 'axios';

// ✅ FIX: Add fallback URL for production
const API_BASE_URL = 'https://fast-food-app-backend.onrender.com';

console.log('🚀 API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('💥 API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const menuAPI = {
  getAll: () => api.get('/api/menu'),
  getById: (id) => api.get(`/api/menu/${id}`),
};

export const ordersAPI = {
  create: (orderData) => api.post('/api/orders', orderData),
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
};

export const paymentAPI = {
  process: (paymentData) => api.post('/api/payment/process', paymentData),
};

export default api;