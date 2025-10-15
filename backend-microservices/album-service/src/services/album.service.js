import { Album } from "../models/album.model.js";
import { callService } from "./httpClient.js";

export const getAllAlbums = async () => {
  // Only return public and visible albums
  const albums = await Album.find({ isPublic: true, isVisible: true }).sort({
    createdAt: -1,
  });
  return albums;
};

export const getAlbumById = async (albumId, userId = null) => {
  const album = await Album.findById(albumId);

  if (!album) {
    throw new Error("Album not found");
  }

  // Check permission: if private, only creator can view
  if (!album.isPublic && album.creatorId !== userId) {
    throw new Error("Access denied");
  }

  // Get songs from Song Service
  if (album.songIds.length > 0) {
    const songs = await callService("song", "/songs/batch", "POST", {
      ids: album.songIds,
    });

    // Filter only public and visible songs for non-creators
    let availableSongs = songs;
    if (album.creatorId !== userId) {
      availableSongs = songs.filter((s) => s.isPublic && s.isVisible);
    }

    return {
      ...album.toObject(),
      songs: availableSongs,
    };
  }

  return {
    ...album.toObject(),
    songs: [],
  };
};

export const createAlbum = async (albumData, user) => {
  if (user.isBlocked) {
    throw new Error("User is blocked");
  }

  // Determine isPublic based on user role
  const isPublic = user.role === "artist" ? albumData.isPublic : false;

  const album = await Album.create({
    ...albumData,
    creatorId: user._id.toString(),
    creatorName: user.fullName,
    isPublic,
    isVisible: true,
  });

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
  } else {
    throw new Error("Users cannot make playlists public");
  }

  return album;
};

export const getUserAlbums = async (userId) => {
  const albums = await Album.find({ creatorId: userId }).sort({
    createdAt: -1,
  });
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
  return album;
};