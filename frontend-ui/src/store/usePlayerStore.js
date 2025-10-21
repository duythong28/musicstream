import { create } from "zustand";

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  volume: 1,
  currentTime: 0,
  duration: 0,
  repeat: false,
  shuffle: false,

  setCurrentSong: (song) =>
    set({
      currentSong: song,
      isPlaying: true,
      duration: song.duration || 0,
      currentTime: 0,
    }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setQueue: (songs, startIndex = 0) =>
    set({
      queue: songs,
      currentIndex: startIndex,
      currentSong: songs[startIndex],
      isPlaying: true,
      duration: songs[startIndex].duration || 0,
      currentTime: 0,
    }),

  playNext: () => {
    const { queue, currentIndex, shuffle, repeat } = get();

    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * queue.length);
      set({
        currentIndex: nextIndex,
        currentSong: queue[nextIndex],
        isPlaying: true,
        duration: queue[nextIndex].duration || 0,
        currentTime: 0,
      });
    } else if (currentIndex < queue.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        currentSong: queue[currentIndex + 1],
        isPlaying: true,
        duration: queue[currentIndex + 1].duration || 0,
        currentTime: 0,
      });
    } else if (repeat) {
      set({
        currentIndex: 0,
        currentSong: queue[0],
        isPlaying: true,
        duration: queue[0].duration || 0,
        currentTime: 0,
      });
    } else {
      // End of queue, stop playback
      set({
        isPlaying: false,
        currentTime: 0,
      });
    }
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();

    if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        currentSong: queue[currentIndex - 1],
        isPlaying: true,
        duration: queue[currentIndex - 1].duration || 0,
        currentTime: 0,
      });
    }
  },

  setVolume: (volume) => set({ volume }),

  setCurrentTime: (currentTime) => set({ currentTime }),

  setDuration: (duration) => set({ duration }),

  toggleRepeat: () => set((state) => ({ repeat: !state.repeat })),

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  clearQueue: () =>
    set({
      queue: [],
      currentSong: null,
      currentIndex: 0,
      isPlaying: false,
      duration: 0,
      currentTime: 0,
    }),
}));
