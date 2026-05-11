import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const userService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getUser: async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await axios.post(`${API_URL}/users`, data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await axios.put(`${API_URL}/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  },

  changePassword: async (id, data) => {
    const response = await axios.post(`${API_URL}/users/${id}/change-password`, data);
    return response.data;
  },

  resetPassword: async (email) => {
    const response = await axios.post(`${API_URL}/users/reset-password`, { email });
    return response.data;
  },
}; 