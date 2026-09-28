import api from './api';

export const getProfileApi = async () => {
  return await api.get('/users/profile');
};

export const updateProfileApi = async (profileData) => {
  return await api.put('/users/profile', profileData);
};

export const changePasswordApi = async (passwordData) => {
  return await api.put('/users/change-password', passwordData);
};
