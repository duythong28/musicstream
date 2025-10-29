import { uploadToCloudinary } from "../config/cloudinary.config.js";
import { Album } from "../models/album.model.js";
import { callService } from "./httpClient.js";
import { cacheGet, cacheSet, cacheDel, cacheInvalidatePattern } from "../config/redis.js"; 

const CACHE_TTL = {
  ALL_ALBUMS: 300, // 5 minutes
  SINGLE_ALBUM: 600, // 10 minutes
  USER_ALBUMS: 300, // 5 minutes
};

export const getAllAlbums = async () => {
  const cacheKey = "albums:all:public";
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log("Cache HIT: All albums");
    return cached;
  }

  console.log("Cache MISS: All albums");
  const albums = await Album.find({ isPublic: true, isVisible: true }).sort({
    createdAt: -1,
  });

  await cacheSet(cacheKey, albums, CACHE_TTL.ALL_ALBUMS);
  return albums;
};

// Get album by ID with songs
export const getAlbumById = async (albumId, userId = null) => {
  const cacheKey = `album:${albumId}`;
  const cached = await cacheGet(cacheKey);

  let album;
  if (cached) {
    console.log(`Cache HIT: Album ${albumId}`);
    album = cached;
  } else {
    console.log(`Cache MISS: Album ${albumId}`);
    album = await Album.findById(albumId);
    if (!album) {
      throw new Error("Album not found");
    }
    album = album.toObject();
  }

  // Check access permission
  if (!album.isPublic && album.creatorId !== userId) {
    throw new Error("Access denied");
  }

  if (!album.isVisible) {
    throw new Error("Album not available");
  }

  try {
    const songs = await callService("song", "/songs/batch", "POST", {
      ids: album.songIds,
    });

    // Filter only public and visible songs
    album.songs = songs.filter((s) => s.isPublic && s.isVisible);
  } catch (error) {
    console.error("Error fetching songs:", error);
    album.songs = [];
  }

  if (!cached) {
    await cacheSet(cacheKey, album, CACHE_TTL.SINGLE_ALBUM);
  }

  return album;
};

export const createAlbum = async (body, file, user) => {
  if (user.isBlocked) {
    throw new Error("User is blocked");
  }
  if (!file) {
    throw new Error("A cover image is required to create an album.");
  }
  if (!body.title) {
    throw new Error("A title is required to create an album.");
  }

  const imageUploadResult = await uploadToCloudinary(file.buffer, {
    resource_type: "image",
  });

  if (!imageUploadResult?.secure_url) {
    throw new Error("Image upload to Cloudinary failed.");
  }

  // Determine isPublic based on user role
  const isPublic = user.role === "artist" ? body.isPublic : false;
  const album = await Album.create({
    title: body.title,
    imageUrl: imageUploadResult.secure_url,
    creatorId: user._id.toString(),
    creatorName: user.fullName,
    isPublic,
    isVisible: true,
  });
  // Invalidate cache
  await cacheInvalidatePattern("albums:*");
  await cacheInvalidatePattern(`user:${user._id}:albums`);

  return album;
};

export const updateAlbum = async (albumId, albumData, user) => {
  const album = await Album.findById(albumId);

  if (!album) {
    throw new Error("Album not found");
  }

  // Check ownership
  if (album.creatorId !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to update this album");
  }

  // Users cannot change private to public
  if (user.role === "user" && albumData.isPublic === true) {
    delete albumData.isPublic;
  }

  Object.assign(album, albumData);
  await album.save();

  // Invalidate cache
  await cacheDel(`album:${albumId}`);
  await cacheInvalidatePattern("albums:*");

  return album;
};

export const deleteAlbum = async (albumId, user) => {
  const album = await Album.findById(albumId);

  if (!album) {
    throw new Error("Album not found");
  }

  // Check ownership
  if (album.creatorId !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to delete this album");
  }

  await Album.findByIdAndDelete(albumId);

  // Invalidate cache
  await cacheDel(`album:${albumId}`);
  await cacheInvalidatePattern("albums:*");

  return album;
};

export const addSongToAlbum = async (albumId, songId, user) => {
  const album = await Album.findById(albumId);

  if (!album) {
    throw new Error("Album not found");
  }

  // Check ownership
  if (album.creatorId !== user._id.toString()) {
    throw new Error("Not authorized to modify this album");
  }

  // Check if song exists
  const song = await callService("song", `/songs/${songId}`, "GET");
  if (!song) {
    throw new Error("Song not found");
  }

  // Check if song already in album
  if (album.songIds.includes(songId)) {
    throw new Error("Song already in album");
  }

  album.songIds.push(songId);
  await album.save();

  // Invalidate cache
  await cacheDel(`album:${albumId}`);
  await cacheInvalidatePattern("albums:*");

  return album;
};

export const removeSongFromAlbum = async (albumId, songId, user) => {
  const album = await Album.findById(albumId);

  if (!album) {
    throw new Error("Album not found");
  }

  // Check ownership
  if (album.creatorId !== user._id.toString()) {
    throw new Error("Not authorized to modify this album");
  }

  album.songIds = album.songIds.filter((id) => id !== songId);
  await album.save();

  // Invalidate cache
  await cacheDel(`album:${albumId}`);
  await cacheInvalidatePattern("albums:*");

  return album;
};

export const toggleAlbumVisibility = async (albumId, user) => {
  const album = await Album.findById(albumId);

  if (!album) {
    throw new Error("Album not found");
  }

  // Check ownership and role
  if (album.creatorId !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to modify this album");
  }

  // Only artists can toggle public/private
  if (user.role === "artist") {
    album.isPublic = !album.isPublic;
    await album.save();
    // Invalidate cache
    await cacheDel(`album:${albumId}`);
    await cacheInvalidatePattern("albums:*");
  } else {
    throw new Error("Users cannot make playlists public");
  }

  return album;
};

export const getUserAlbums = async (userId) => {
  const cacheKey = `user:${userId}:albums`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log(`Cache HIT: User ${userId} albums`);
    return cached;
  }

  console.log(`Cache MISS: User ${userId} albums`);
  const albums = await Album.find({ creatorId: userId }).sort({
    createdAt: -1,
  });

  await cacheSet(cacheKey, albums, CACHE_TTL.USER_ALBUMS);
  return albums;
};

// Admin services
export const adminGetAllAlbums = async () => {
  const albums = await Album.find().sort({ createdAt: -1 });
  return albums;
};

export const adminToggleVisible = async (albumId) => {
  const album = await Album.findById(albumId);

  if (!album) {
    throw new Error("Album not found");
  }

  album.isVisible = !album.isVisible;
  await album.save();
  // Invalidate cache
  await cacheDel(`album:${albumId}`);
  await cacheInvalidatePattern("albums:*");
  return album;
};
