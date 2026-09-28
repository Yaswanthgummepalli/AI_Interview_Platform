import api from './api';

export const ALLOWED_TECHNOLOGIES = [
  'JavaScript',
  'React',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Java',
  'SQL'
];

export const getQuestionsApi = async (params = {}) => {
  return await api.get('/questions', { params });
};

export const getQuestionByIdApi = async (id) => {
  return await api.get(`/questions/${id}`);
};

export const createQuestionApi = async (questionData) => {
  return await api.post('/questions', questionData);
};

export const updateQuestionApi = async (id, questionData) => {
  return await api.put(`/questions/${id}`, questionData);
};

export const deleteQuestionApi = async (id) => {
  return await api.delete(`/questions/${id}`);
};
