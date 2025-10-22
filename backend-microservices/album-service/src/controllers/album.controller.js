import {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum,
  toggleAlbumVisibility,
  getUserAlbums,
} from "../services/album.service.js";

export const listAlbums = async (req, res) => {
  try {
    const albums = await getAllAlbums();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAlbum = async (req, res) => {
  try {
    const userId = req.user?._id.toString() || null;
    const album = await getAlbumById(req.params.id, userId);
    res.json(album);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createNewAlbum = async (req, res) => {
  try {
    const album = await createAlbum(req.body, req.file, req.user);
    res.status(201).json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editAlbum = async (req, res) => {
  try {
    const album = await updateAlbum(req.params.id, req.body, req.user);
    res.json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeAlbum = async (req, res) => {
  try {
    await deleteAlbum(req.params.id, req.user);
    res.json({ message: "Album deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const album = await addSongToAlbum(req.params.id, songId, req.user);
    res.json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeSong = async (req, res) => {
  try {
    const album = await removeSongFromAlbum(
      req.params.id,
      req.params.songId,
      req.user
    );
    res.json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const toggleVisibility = async (req, res) => {
  try {
    const album = await toggleAlbumVisibility(req.params.id, req.user);
    res.json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyAlbums = async (req, res) => {
  try {
    const albums = await getUserAlbums(req.user._id.toString());
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};