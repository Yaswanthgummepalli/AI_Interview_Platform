import api from './api';

export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const loginUser = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

export const logoutUser = async () => {
  try {
    return await api.post('/auth/logout');
  } catch (error) {
    // Return graceful response even if backend endpoint fails
    return { success: true };
  }
};
