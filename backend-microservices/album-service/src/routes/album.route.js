import { Router } from "express";
import {
  listAlbums,
  getAlbum,
  createNewAlbum,
  editAlbum,
  removeAlbum,
  addSong,
  removeSong,
  toggleVisibility,
  getMyAlbums,
} from "../controllers/album.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireArtist } from "../middleware/role.middleware.js";
import { uploadAlbumImage } from "../middleware/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", listAlbums);
router.get("/:id", getAlbum);

// Authenticated routes (Artist + User)
router.post("/", requireAuth, uploadAlbumImage, createNewAlbum);
router.patch("/:id", requireAuth, editAlbum);
router.delete("/:id", requireAuth, removeAlbum);
router.post("/:id/songs", requireAuth, addSong);
router.delete("/:id/songs/:songId", requireAuth, removeSong);
router.get("/user/my-albums", requireAuth, getMyAlbums);

// Artist only
router.patch("/:id/visibility", requireAuth, requireArtist, toggleVisibility);

export default router;