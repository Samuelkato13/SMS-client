import api from './api';

const examService = {
  getExams: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  getExam: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  createExam: async (data) => {
    const response = await api.post('/exams', data);
    return response.data;
  },

  updateExam: async (id, data) => {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },

  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  getClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },
};

export { examService }; 