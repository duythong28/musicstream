// song-service/src/controllers/song.controller.js
import {
  getAllSongs,
  getSongById,
  getSongsByIds,
  createSong,
  updateSong,
  deleteSong,
  toggleSongVisibility,
  getArtistSongs,
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
    const song = await createSong(req.body, req.user);
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
