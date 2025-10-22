import { getAuth } from "@clerk/express";

export const optionalAuth = async (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.auth = { userId: userId };

    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.auth = { userId: userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};