import { User } from "../models/user.model.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};