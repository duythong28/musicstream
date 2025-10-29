import { createClient } from "redis";

let redisClient = null;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error("Redis: Too many retries, stopping reconnection");
            return new Error("Too many retries");
          }
          return retries * 100;
        },
      },
    });

    redisClient.on("error", (err) => console.error("Redis Client Error:", err));
    redisClient.on("connect", () => console.log("Redis Client Connected"));
    redisClient.on("ready", () => console.log("Redis Client Ready"));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    console.warn("Redis client not available");
    return null;
  }
  return redisClient;
};

export const cacheGet = async (key) => {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis GET error:", error);
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds = 3600) => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Redis SET error:", error);
    return false;
  }
};

export const cacheDel = async (key) => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error("Redis DEL error:", error);
    return false;
  }
};

export const cacheInvalidatePattern = async (pattern) => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (error) {
    console.error("Redis invalidate pattern error:", error);
    return false;
  }
};