import { getAuth } from "@clerk/express";
import { callService } from "../services/httpClient.js";

export const requireAuth = async (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user from User Service
    const user = await callService("user", `/auth/me`, "GET", null, {
      authorization: req.headers.authorization,
      "x-clerk-session-id": req.headers["x-clerk-session-id"],
    });

    req.auth = { userId: userId };
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return next();
    }

    // Try to get user from User Service; if it fails, continue without blocking
    const user = await callService("user", `/auth/me`, "GET", null, {
      authorization: req.headers.authorization,
      "x-clerk-session-id": req.headers["x-clerk-session-id"],
    });

    req.auth = { userId };
    req.user = user;
    return next();
  } catch (error) {
    // On any error, don't enforce auth — proceed as unauthenticated
    return next();
  }
};
