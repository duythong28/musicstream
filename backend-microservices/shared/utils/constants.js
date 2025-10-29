export const USER_ROLES = {
  ADMIN: "admin",
  ARTIST: "artist",
  USER: "user",
};

export const SERVICE_PORTS = {
  USER: 3001,
  SONG: 3002,
  ALBUM: 3003,
  GATEWAY: 3000,
};

export const SERVICE_URLS = {
  USER: process.env.USER_SERVICE_URL || "http://localhost:3001",
  SONG: process.env.SONG_SERVICE_URL || "http://localhost:3002",
  ALBUM: process.env.ALBUM_SERVICE_URL || "http://localhost:3003",
};