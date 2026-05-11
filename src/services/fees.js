import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const feesService = {
  getFees: async () => {
    const response = await axios.get(`${API_URL}/fees`);
    return response.data;
  },

  getFee: async (id) => {
    const response = await axios.get(`${API_URL}/fees/${id}`);
    return response.data;
  },

  createFee: async (data) => {
    const response = await axios.post(`${API_URL}/fees`, data);
    return response.data;
  },

  updateFee: async (id, data) => {
    const response = await axios.put(`${API_URL}/fees/${id}`, data);
    return response.data;
  },

  deleteFee: async (id) => {
    const response = await axios.delete(`${API_URL}/fees/${id}`);
    return response.data;
  }
}; 