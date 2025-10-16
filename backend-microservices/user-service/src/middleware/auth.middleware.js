// user-service/src/middleware/auth.middleware.js
import { getAuth } from "@clerk/express";

export const requireAuth = async (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.auth = { userId: userId };
    next();
  } catch (error) {
    console.error("Auth error:", error);

    res.status(401).json({ error: "Invalid token" });
  }
};
