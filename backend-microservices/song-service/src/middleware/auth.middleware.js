// song-service/src/middleware/auth.middleware.js
import { clerkClient } from "@clerk/clerk-sdk-node";
import { callService } from "../services/httpClient.js";

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

    // Get user from User Service
    const user = await callService("user", `/auth/me`, "GET", null, {
      authorization: req.headers.authorization,
      "x-clerk-session-id": req.headers["x-clerk-session-id"],
    });

    req.auth = { userId: session.userId };
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
