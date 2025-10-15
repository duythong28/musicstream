// user-service/src/middleware/auth.middleware.js
import { clerkClient } from "@clerk/clerk-sdk-node";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const session = await clerkClient.sessions.verifySession(
      req.headers["x-clerk-session-id"],
      token
    );

    req.auth = { userId: session.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

