import api from './api';

const studentService = {
  getStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  getStudent: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (data) => {
    const response = await api.post('/students', data);
    return response.data;
  },

  updateStudent: async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  getClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },
};

export { studentService }; 