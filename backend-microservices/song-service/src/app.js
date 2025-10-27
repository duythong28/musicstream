import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import songRoutes from "./routes/song.route.js";
import adminRoutes from "./routes/admin.route.js";
import { clerkMiddleware } from "@clerk/express";
import { connectRedis } from "./config/redis.js";
import { initializeRecombee } from "./services/recombee.service.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "song-service" });
});

app.use("/songs", songRoutes);
app.use("/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const startServer = async () => {
  try {
    await connectDB();
    // Connect Redis
    const redisClient = await connectRedis();
    if (redisClient) {
      global.redisConnected = true;
      console.log("✅ Redis connected successfully");
    } else {
      console.warn("⚠️ Running without Redis cache");
      global.redisConnected = false;
    }

    try {
      await initializeRecombee();
      global.recombeeInitialized = true;
      console.log("✅ Recombee initialized successfully");
    } catch (error) {
      console.error("⚠️ Recombee initialization failed:", error.message);
      console.warn("Running without recommendation engine");
      global.recombeeInitialized = false;
    }

    app.listen(PORT, () => {
      console.log(`🚀 Song Service running on port ${PORT}`);
      console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
      console.log(
        `🎵 Recommendation engine: ${
          global.recombeeInitialized ? "ACTIVE" : "INACTIVE"
        }`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
