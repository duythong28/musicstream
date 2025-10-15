import { clerkClient } from "@clerk/clerk-sdk-node";

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const sessionId = req.headers["x-clerk-session-id"];

    if (token && sessionId) {
      const session = await clerkClient.sessions.verifySession(sessionId, token);
      req.auth = { userId: session.userId };
    }

    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const sessionId = req.headers["x-clerk-session-id"];

    if (!token || !sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const session = await clerkClient.sessions.verifySession(sessionId, token);
    req.auth = { userId: session.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};