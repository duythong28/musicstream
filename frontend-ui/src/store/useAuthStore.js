import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  registerUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(userData);
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearUser: () => set({ user: null }),

  isAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === "admin";
  },

  isArtist: () => {
    const state = useAuthStore.getState();
    return state.user?.role === "artist" || state.user?.role === "admin";
  },
}));