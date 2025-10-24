import api from "./api";

const noCacheHeaders = {
  headers: {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0",
  },
};

export const recommendationService = {
  // Track song play
  trackPlay: async (songId) => {
    try {
      await api.post(`/songs/${songId}/track/play`);
      console.log(`✅ Tracked play for song ${songId}`);
    } catch (error) {
      console.error("Error tracking play:", error);
    }
  },

  // Track song completion (when user listens to 80%+)
  trackComplete: async (songId) => {
    try {
      await api.post(`/songs/${songId}/track/complete`);
      console.log(`✅ Tracked completion for song ${songId}`);
    } catch (error) {
      console.error("Error tracking complete:", error);
    }
  },

  // Track song skip
  trackSkip: async (songId) => {
    try {
      await api.post(`/songs/${songId}/track/skip`);
      console.log(`✅ Tracked skip for song ${songId}`);
    } catch (error) {
      console.error("Error tracking skip:", error);
    }
  },

  // Get personalized recommendations
  getRecommendations: async (count = 10) => {
    try {
      const response = await api.get(`/songs/recommendations/for-you?count=${count}&t=${Date.now()}`);
      return response.data;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  },

  // Get similar songs
  getSimilarSongs: async (songId, count = 10) => {
    try {
      const response = await api.get(`/songs/${songId}/similar?count=${count}&t=${Date.now()}`);
      return response.data;
    } catch (error) {
      console.error("Error getting similar songs:", error);
      return [];
    }
  },

  // Get trending songs
  getTrendingSongs: async (count = 20) => {
    try {
      const response = await api.get(`/songs/trending?count=${count}&t=${Date.now()}`);
      return response.data;
    } catch (error) {
      console.error("Error getting trending songs:", error);
      return [];
    }
  },
};