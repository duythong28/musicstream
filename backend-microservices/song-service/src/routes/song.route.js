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
  trackPlay,
  trackComplete,
  trackSkip,
  getRecommendations,
  getSimilar,
  getTrending,
} from "../controllers/song.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireArtist } from "../middleware/role.middleware.js";
import { uploadSongFiles } from "../middleware/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", listSongs);
router.get("/trending", getTrending);
router.get("/:id", getSong);
router.get("/:id/similar", getSimilar);
router.post("/batch", getBatchSongs);

// Authenticated routes
router.post("/:id/track/play", requireAuth, trackPlay);
router.post("/:id/track/complete", requireAuth, trackComplete);
router.post("/:id/track/skip", requireAuth, trackSkip);
router.get("/recommendations/for-you", requireAuth, getRecommendations);

// Artist routes
router.post("/", requireAuth, requireArtist, uploadSongFiles, uploadSong);
router.patch("/:id", requireAuth, requireArtist, editSong);
router.delete("/:id", requireAuth, requireArtist, removeSong);
router.patch("/:id/visibility", requireAuth, requireArtist, toggleVisibility);
router.get("/artist/my-songs", requireAuth, requireArtist, getMyArtistSongs);

export default router;
