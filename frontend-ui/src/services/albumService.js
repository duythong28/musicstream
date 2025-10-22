import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const albumService = {
  getAllAlbums: async () => {
    const response = await api.get(API_ENDPOINTS.ALBUMS);
    return response.data;
  },

  getAlbumById: async (albumId) => {
    const response = await api.get(`${API_ENDPOINTS.ALBUMS}/${albumId}`);
    return response.data;
  },

  createAlbum: async (data) => {
    const response = await api.post(API_ENDPOINTS.ALBUMS, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateAlbum: async (albumId, data) => {
    const response = await api.patch(
      `${API_ENDPOINTS.ALBUMS}/${albumId}`,
      data
    );
    return response.data;
  },

  deleteAlbum: async (albumId) => {
    const response = await api.delete(`${API_ENDPOINTS.ALBUMS}/${albumId}`);
    return response.data;
  },

  addSongToAlbum: async (albumId, songId) => {
    const response = await api.post(
      `${API_ENDPOINTS.ALBUMS}/${albumId}/songs`,
      { songId }
    );
    return response.data;
  },

  removeSongFromAlbum: async (albumId, songId) => {
    const response = await api.delete(
      `${API_ENDPOINTS.ALBUMS}/${albumId}/songs/${songId}`
    );
    return response.data;
  },

  toggleVisibility: async (albumId) => {
    const response = await api.patch(
      `${API_ENDPOINTS.ALBUMS}/${albumId}/visibility`
    );
    return response.data;
  },

  getMyAlbums: async () => {
    const response = await api.get(API_ENDPOINTS.MY_ALBUMS);
    return response.data;
  },
};
