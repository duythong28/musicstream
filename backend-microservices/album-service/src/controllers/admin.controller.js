import {
  adminGetAllAlbums,
  adminToggleVisible,
} from "../services/album.service.js";

export const getAllAlbumsAdmin = async (req, res) => {
  try {
    const albums = await adminGetAllAlbums();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleAlbumVisible = async (req, res) => {
  try {
    const album = await adminToggleVisible(req.params.id);
    res.json(album);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};