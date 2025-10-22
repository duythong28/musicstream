// user-service/src/routes/admin.route.js
import { Router } from "express";
import {
  listUsers,
  blockUser,
  removeUser,
  changeUserRole,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listUsers);
router.patch("/users/:id/block", blockUser);
router.delete("/users/:id", removeUser);
router.patch("/users/:id/role", changeUserRole);

export default router;
