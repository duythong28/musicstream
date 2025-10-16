import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const authService = {
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH_REGISTER, userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH_ME);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`${API_ENDPOINTS.USERS}/${userId}`);
    return response.data;
  },
};