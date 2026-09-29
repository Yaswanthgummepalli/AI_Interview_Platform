import api from './api';

export const getAssessmentsApi = async (params = {}) => {
  return await api.get('/assessments', { params });
};

export const getAssessmentByIdApi = async (id) => {
  return await api.get(`/assessments/${id}`);
};

export const createAssessmentApi = async (assessmentData) => {
  return await api.post('/assessments', assessmentData);
};

export const updateAssessmentApi = async (id, assessmentData) => {
  return await api.put(`/assessments/${id}`, assessmentData);
};

export const deleteAssessmentApi = async (id) => {
  return await api.delete(`/assessments/${id}`);
};

export const publishAssessmentApi = async (id) => {
  return await api.patch(`/assessments/${id}/publish`);
};

export const unpublishAssessmentApi = async (id) => {
  return await api.patch(`/assessments/${id}/unpublish`);
};

// Assessment taking APIs
export const startAssessmentApi = async (assessmentId) => {
  return await api.post(`/assessments/${assessmentId}/start`);
};

export const getAttemptApi = async (attemptId) => {
  return await api.get(`/assessments/attempts/${attemptId}`);
};

export const saveAnswerApi = async (attemptId, payload) => {
  return await api.put(`/assessments/attempts/${attemptId}/answer`, payload);
};

export const submitAttemptApi = async (attemptId) => {
  return await api.post(`/assessments/attempts/${attemptId}/submit`);
};

// Result and history APIs
export const getAttemptResultApi = async (attemptId) => {
  return await api.get(`/assessments/attempts/${attemptId}/result`);
};

export const getUserAttemptsApi = async () => {
  return await api.get(`/assessments/my/attempts`);
};

export const getAdminAttemptsApi = async () => {
  return await api.get(`/admin/attempts`);
};

export const getUserDashboardApi = async () => {
  return await api.get('/dashboard/user');
};

export const getAdminDashboardApi = async () => {
  return await api.get('/dashboard/admin');
};
