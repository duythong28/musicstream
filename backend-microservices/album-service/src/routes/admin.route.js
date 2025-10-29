import { Router } from "express";
import {
  getAllAlbumsAdmin,
  toggleAlbumVisible,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/albums", getAllAlbumsAdmin);
router.patch("/albums/:id/visible", toggleAlbumVisible);

export default router;