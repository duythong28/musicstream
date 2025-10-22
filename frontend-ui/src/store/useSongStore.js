import { create } from "zustand";
import { songService } from "../services/songService";

export const useSongStore = create((set) => ({
  songs: [],
  isLoading: false,
  error: null,

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const songs = await songService.getAllSongs();
      set({ songs, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addSong: (song) =>
    set((state) => ({ songs: [song, ...state.songs] })),

  updateSong: (songId, updatedData) =>
    set((state) => ({
      songs: state.songs.map((song) =>
        song._id === songId ? { ...song, ...updatedData } : song
      ),
    })),

  removeSong: (songId) =>
    set((state) => ({
      songs: state.songs.filter((song) => song._id !== songId),
    })),
}));