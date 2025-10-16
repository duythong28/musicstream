import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const songService = {
  getAllSongs: async () => {
    const response = await api.get(API_ENDPOINTS.SONGS);
    return response.data;
  },

  getSongById: async (songId) => {
    const response = await api.get(`${API_ENDPOINTS.SONGS}/${songId}`);
    return response.data;
  },

  getSongsByIds: async (songIds) => {
    const response = await api.post(API_ENDPOINTS.SONGS_BATCH, { ids: songIds });
    return response.data;
  },

  uploadSong: async (formData) => {
    const response = await api.post(API_ENDPOINTS.SONGS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateSong: async (songId, data) => {
    const response = await api.patch(`${API_ENDPOINTS.SONGS}/${songId}`, data);
    return response.data;
  },

  deleteSong: async (songId) => {
    const response = await api.delete(`${API_ENDPOINTS.SONGS}/${songId}`);
    return response.data;
  },

  toggleVisibility: async (songId) => {
    const response = await api.patch(`${API_ENDPOINTS.SONGS}/${songId}/visibility`);
    return response.data;
  },

  getMySongs: async () => {
    const response = await api.get(API_ENDPOINTS.MY_SONGS);
    return response.data;
  },
};