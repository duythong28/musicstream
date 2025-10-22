// user-service/src/controllers/auth.controller.js
import { createUser, getUserByClerkId } from "../services/user.service.js";

export const register = async (req, res) => {
  try {
    const { clerkId, fullName, email, imageUrl, role } = req.body;

    const user = await createUser({
      clerkId,
      fullName,
      email,
      imageUrl,
      role: role || "user",
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserByClerkId(req.auth.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
