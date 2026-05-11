import api from './api';

const schoolService = {
  getSchools: async () => {
    const response = await api.get('/schools');
    return response.data;
  },

  getSchool: async (id) => {
    const response = await api.get(`/schools/${id}`);
    return response.data;
  },

  createSchool: async (data) => {
    const response = await api.post('/schools', data);
    return response.data;
  },

  updateSchool: async (id, data) => {
    const response = await api.put(`/schools/${id}`, data);
    return response.data;
  },

  deleteSchool: async (id) => {
    const response = await api.delete(`/schools/${id}`);
    return response.data;
  },
};

export { schoolService }; 