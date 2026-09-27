import api from './api';

export const checkHealth = async () => {
  try {
    const data = await api.get('/health');
    return data;
  } catch (error) {
    throw error;
  }
};
