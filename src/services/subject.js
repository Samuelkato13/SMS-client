import api from './api';

const subjectService = {
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  getSubject: async (id) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  createSubject: async (data) => {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  updateSubject: async (id, data) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  getTeachers: async () => {
    const response = await api.get('/teachers');
    return response.data;
  },
};

export { subjectService }; 