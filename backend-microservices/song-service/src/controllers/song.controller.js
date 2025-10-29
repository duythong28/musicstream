import {
  getAllSongs,
  getSongById,
  getSongsByIds,
  createSong,
  updateSong,
  deleteSong,
  toggleSongVisibility,
  getArtistSongs,
  trackSongPlay,
  trackSongComplete,
  trackSongSkip,
  getPersonalizedRecommendations,
  getSimilarSongs,
  getTrendingSongs,
} from "../services/song.service.js";

export const listSongs = async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSong = async (req, res) => {
  try {
    const song = await getSongById(req.params.id);
    res.json(song);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getBatchSongs = async (req, res) => {
  try {
    const { ids } = req.body;
    const songs = await getSongsByIds(ids);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadSong = async (req, res) => {
  try {
    const song = await createSong(req.body, req.files, req.user);
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editSong = async (req, res) => {
  try {
    const song = await updateSong(req.params.id, req.body, req.user);
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeSong = async (req, res) => {
  try {
    await deleteSong(req.params.id, req.user);
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const toggleVisibility = async (req, res) => {
  try {
    const song = await toggleSongVisibility(req.params.id, req.user);
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyArtistSongs = async (req, res) => {
  try {
    const songs = await getArtistSongs(req.user._id.toString());
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track song play
export const trackPlay = async (req, res) => {
  try {
    const { id: songId } = req.params;
    const userId = req.user._id.toString();

    await trackSongPlay(songId, userId);
    res.json({ message: "Play tracked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track song completion
export const trackComplete = async (req, res) => {
  try {
    const { id: songId } = req.params;
    const userId = req.user._id.toString();

    await trackSongComplete(songId, userId);
    res.json({ message: "Completion tracked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track song skip
export const trackSkip = async (req, res) => {
  try {
    const { id: songId } = req.params;
    const userId = req.user._id.toString();

    await trackSongSkip(songId, userId);
    res.json({ message: "Skip tracked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get personalized recommendations
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const count = parseInt(req.query.count) || 10;

    const recommendations = await getPersonalizedRecommendations(userId, count);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get similar songs
export const getSimilar = async (req, res) => {
  try {
    const { id: songId } = req.params;
    const count = parseInt(req.query.count) || 10;

    const similar = await getSimilarSongs(songId, count);
    res.json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get trending songs
export const getTrending = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 20;
    const trending = await getTrendingSongs(count);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
