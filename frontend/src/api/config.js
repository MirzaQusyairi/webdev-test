import axios from 'axios';
import { cookieUtils } from '../utils/cookies';

// Base URL untuk API - menggunakan environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Instance axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = cookieUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookieUtils.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
