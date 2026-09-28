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
