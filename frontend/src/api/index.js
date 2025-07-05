import apiClient from './config';

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/login', credentials),
  logout: () => apiClient.post('/logout'),
  me: () => apiClient.get('/me'),
};

// Customers API
export const customersAPI = {
  getAll: () => apiClient.get('/customers'),
  getById: (id) => apiClient.get(`/customers/${id}`),
  create: (data) => apiClient.post('/customers', data),
  update: (id, data) => apiClient.put(`/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
};

// Products API
export const productsAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

// Sales API
export const salesAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  create: (data) => apiClient.post('/orders', data),
  update: (id, data) => apiClient.put(`/orders/${id}`, data),
  delete: (id) => apiClient.delete(`/orders/${id}`),
};
