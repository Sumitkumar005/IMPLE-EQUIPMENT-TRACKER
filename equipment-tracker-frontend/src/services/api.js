import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const equipmentAPI = {
  // Get all equipment
  getAll: async () => {
    const response = await api.get('/equipment');
    return response.data.data; // Extract the data array from the response
  },

  // Create new equipment
  create: async (equipmentData) => {
    const response = await api.post('/equipment', equipmentData);
    return response.data.data; // Extract the data from the response
  },

  // Update equipment
  update: async (id, equipmentData) => {
    const response = await api.put(`/equipment/${id}`, equipmentData);
    return response.data.data; // Extract the data from the response
  },

  // Delete equipment
  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data.data; // Extract the data from the response
  },
};

export default api;