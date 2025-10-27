import { Router } from "express";
import {
  getAllSongsAdmin,
  toggleSongVisible,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/songs", getAllSongsAdmin);
router.patch("/songs/:id/visible", toggleSongVisible);

export default router;
