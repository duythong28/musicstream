// song-service/src/controllers/admin.controller.js
import {
  adminGetAllSongs,
  adminToggleVisible,
} from "../services/song.service.js";

export const getAllSongsAdmin = async (req, res) => {
  try {
    const songs = await adminGetAllSongs();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleSongVisible = async (req, res) => {
  try {
    const song = await adminToggleVisible(req.params.id);
    res.json(song);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
