import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  let service = "Unknown";
  if (
    req.path.startsWith("/api/auth") ||
    req.path.startsWith("/api/users") ||
    req.path.startsWith("/api/admin/users")
  ) {
    service = "User Service";
  } else if (
    req.path.startsWith("/api/songs") ||
    req.path.startsWith("/api/admin/songs")
  ) {
    service = "Song Service";
  } else if (
    req.path.startsWith("/api/albums") ||
    req.path.startsWith("/api/admin/albums")
  ) {
    service = "Album Service";
  }
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${
      req.originalUrl
    } -> ${service}`
  );
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health/services", async (req, res) => {
  const services = {
    user: process.env.USER_SERVICE_URL || "http://localhost:3001",
    song: process.env.SONG_SERVICE_URL || "http://localhost:3002",
    album: process.env.ALBUM_SERVICE_URL || "http://localhost:3003",
  };

  const healthChecks = await Promise.allSettled(
    Object.entries(services).map(async ([name, url]) => {
      try {
        const response = await fetch(`${url}/health`);
        const data = await response.json();
        return { name, status: "healthy", data };
      } catch (error) {
        return { name, status: "unhealthy", error: error.message };
      }
    })
  );

  res.json({
    gateway: "healthy",
    services: healthChecks.map((result) => result.value),
  });
});

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    // Forward all headers including auth
    if (req.headers.authorization) {
      proxyReq.setHeader("authorization", req.headers.authorization);
    }
    if (req.headers["x-clerk-session-id"]) {
      proxyReq.setHeader(
        "x-clerk-session-id",
        req.headers["x-clerk-session-id"]
      );
    }
  },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(503).json({
      error: "Service unavailable",
      message: "The requested service is currently unavailable",
    });
  },
});

// User Service routes
app.use(
  "/api/auth",
  createProxyMiddleware({
    ...proxyOptions(process.env.USER_SERVICE_URL || "http://localhost:3001"),
    pathRewrite: { "^/api/auth": "/auth" },
  })
);

app.use(
  "/api/users",
  createProxyMiddleware({
    ...proxyOptions(process.env.USER_SERVICE_URL || "http://localhost:3001"),
    pathRewrite: { "^/api/users": "/users" },
  })
);

app.use(
  "/api/admin/users",
  createProxyMiddleware({
    ...proxyOptions(process.env.USER_SERVICE_URL || "http://localhost:3001"),
    pathRewrite: { "^/api/admin/users": "/admin/users" },
  })
);

// Song Service routes
app.use(
  "/api/songs",
  createProxyMiddleware({
    ...proxyOptions(process.env.SONG_SERVICE_URL || "http://localhost:3002"),
    pathRewrite: { "^/api/songs": "/songs" },
  })
);

app.use(
  "/api/admin/songs",
  createProxyMiddleware({
    ...proxyOptions(process.env.SONG_SERVICE_URL || "http://localhost:3002"),
    pathRewrite: { "^/api/admin/songs": "/admin/songs" },
  })
);

// Album Service routes
app.use(
  "/api/albums",
  createProxyMiddleware({
    ...proxyOptions(process.env.ALBUM_SERVICE_URL || "http://localhost:3003"),
    pathRewrite: { "^/api/albums": "/albums" },
  })
);

app.use(
  "/api/admin/albums",
  createProxyMiddleware({
    ...proxyOptions(process.env.ALBUM_SERVICE_URL || "http://localhost:3003"),
    pathRewrite: { "^/api/admin/albums": "/admin/albums" },
  })
);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(
    `User Service: ${process.env.USER_SERVICE_URL || "http://localhost:3001"}`
  );
  console.log(
    `Song Service: ${process.env.SONG_SERVICE_URL || "http://localhost:3002"}`
  );
  console.log(
    `Album Service: ${process.env.ALBUM_SERVICE_URL || "http://localhost:3003"}`
  );
});
