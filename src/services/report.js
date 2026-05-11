import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const reportService = {
  getAvailableReports: async () => {
    const response = await axios.get(`${API_URL}/reports/available`);
    return response.data;
  },

  generateCustomReport: async (config) => {
    const response = await axios.post(`${API_URL}/reports/generate`, config);
    return response.data;
  },

  getAcademicReports: async (filters) => {
    const response = await axios.get(`${API_URL}/reports/academic`, { params: filters });
    return response.data;
  },

  getFinancialReports: async (filters) => {
    const response = await axios.get(`${API_URL}/reports/financial`, { params: filters });
    return response.data;
  },

  getAttendanceReports: async (filters) => {
    const response = await axios.get(`${API_URL}/reports/attendance`, { params: filters });
    return response.data;
  },
}; 