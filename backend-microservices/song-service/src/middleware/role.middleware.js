export const requireArtist = async (req, res, next) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "artist" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ error: "Artist access required" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
