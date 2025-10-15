// song-service/src/routes/song.route.js
import { Router } from "express";
import {
  listSongs,
  getSong,
  getBatchSongs,
  uploadSong,
  editSong,
  removeSong,
  toggleVisibility,
  getMyArtistSongs,
} from "../controllers/song.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireArtist } from "../middleware/role.middleware.js";

const router = Router();

// Public routes
router.get("/", listSongs);
router.get("/:id", getSong);
router.post("/batch", getBatchSongs);

// Artist routes
router.post("/", requireAuth, requireArtist, uploadSong);
router.patch("/:id", requireAuth, requireArtist, editSong);
router.delete("/:id", requireAuth, requireArtist, removeSong);
router.patch("/:id/visibility", requireAuth, requireArtist, toggleVisibility);
router.get("/artist/my-songs", requireAuth, requireArtist, getMyArtistSongs);

export default router;
