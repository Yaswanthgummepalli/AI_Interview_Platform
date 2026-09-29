import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interviewai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for generic error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthRequest = url.includes('/auth/') || url.includes('/health');
    const isLoginRequest = url.includes('/auth/login');

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('interviewai_token');
      localStorage.removeItem('interviewai_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status,
      details: error.response?.data?.errors || null
    };

    if (status === 401 && isLoginRequest) {
      customError.message = 'Incorrect email or password.';
    } else if (status === 401) {
      customError.message = 'Your session has expired. Please log in again.';
    } else if (status === 403) {
      customError.message = 'You do not have permission to access this page.';
    } else if (status === 404) {
      customError.message = 'Requested resource was not found.';
    } else if (status >= 500) {
      customError.message = 'Something went wrong. Please try again.';
    }

    return Promise.reject(customError);
  }
);

export default api;
