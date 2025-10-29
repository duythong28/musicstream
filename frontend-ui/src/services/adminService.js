import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const adminService = {
  // User Management
  getAllUsers: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN_USERS);
    return response.data;
  },

  toggleBlockUser: async (userId) => {
    const response = await api.patch(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/block`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`);
    return response.data;
  },

  changeUserRole: async (userId, role) => {
    const response = await api.patch(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/role`, { role });
    return response.data;
  },

  // Song Management
  getAllSongsAdmin: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN_SONGS);
    return response.data;
  },

  toggleSongVisible: async (songId) => {
    const response = await api.patch(`${API_ENDPOINTS.ADMIN_SONGS}/${songId}/visible`);
    return response.data;
  },

  // Album Management
  getAllAlbumsAdmin: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN_ALBUMS);
    return response.data;
  },

  toggleAlbumVisible: async (albumId) => {
    const response = await api.patch(`${API_ENDPOINTS.ADMIN_ALBUMS}/${albumId}/visible`);
    return response.data;
  },
};