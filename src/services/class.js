import api from './api';

const classService = {
  getClasses: async (schoolId = null) => {
    const params = schoolId ? { school_id: schoolId } : {};
    const response = await api.get('/classes', { params });
    return response.data;
  },

  getClass: async (id) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  createClass: async (data) => {
    console.log('Class service - creating class with data:', data);
    console.log('API base URL:', api.defaults.baseURL);
    console.log('Auth token:', localStorage.getItem('token'));
    
    const response = await api.post('/classes', data);
    console.log('Class service - response received:', response);
    return response.data;
  },

  updateClass: async (id, data) => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  getTeachers: async () => {
    const response = await api.get('/teachers');
    return response.data;
  },
};

export { classService }; 