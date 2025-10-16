export const USER_ROLES = {
  ADMIN: "admin",
  ARTIST: "artist",
  USER: "user",
};

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: "/auth/register",
  AUTH_ME: "/auth/me",
  
  // Users
  USERS: "/users",
  
  // Songs
  SONGS: "/songs",
  SONGS_BATCH: "/songs/batch",
  MY_SONGS: "/songs/artist/my-songs",
  
  // Albums
  ALBUMS: "/albums",
  MY_ALBUMS: "/albums/user/my-albums",
  
  // Admin
  ADMIN_USERS: "/admin/users",
  ADMIN_SONGS: "/admin/songs",
  ADMIN_ALBUMS: "/admin/albums",
};

export const ROUTES = {
  HOME: "/",
  SONGS: "/songs",
  ALBUMS: "/albums",
  ALBUM_DETAIL: "/albums/:id",
  MY_LIBRARY: "/library",
  ARTIST_DASHBOARD: "/artist",
  ADMIN_DASHBOARD: "/admin",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
};