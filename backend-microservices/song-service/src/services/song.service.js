// song-service/src/services/song.service.js
import { Song } from "../models/song.model.js";

export const getAllSongs = async () => {
  // Only return public and visible songs
  const songs = await Song.find({ isPublic: true, isVisible: true }).sort({ createdAt: -1 });
  return songs;
};

export const getSongById = async (songId) => {
  const song = await Song.findById(songId);
  if (!song) {
    throw new Error("Song not found");
  }
  return song;
};

export const getSongsByIds = async (songIds) => {
  const songs = await Song.find({ _id: { $in: songIds } });
  return songs;
};

export const createSong = async (songData, user) => {
  if (user.role !== "artist" && user.role !== "admin") {
    throw new Error("Only artists can upload songs");
  }

  const song = await Song.create({
    ...songData,
    artistId: user._id.toString(),
    artistName: user.fullName,
    isPublic: true,
    isVisible: true,
  });

  return song;
};

export const updateSong = async (songId, songData, user) => {
  const song = await Song.findById(songId);
  
  if (!song) {
    throw new Error("Song not found");
  }

  // Check ownership (only artist who created or admin can update)
  if (song.artistId !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to update this song");
  }

  Object.assign(song, songData);
  await song.save();
  return song;
};

export const deleteSong = async (songId, user) => {
  const song = await Song.findById(songId);
  
  if (!song) {
    throw new Error("Song not found");
  }

  // Check ownership
  if (song.artistId !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to delete this song");
  }

  await Song.findByIdAndDelete(songId);
  return song;
};

export const toggleSongVisibility = async (songId, user) => {
  const song = await Song.findById(songId);
  
  if (!song) {
    throw new Error("Song not found");
  }

  // Check ownership
  if (song.artistId !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to modify this song");
  }

  song.isPublic = !song.isPublic;
  await song.save();
  return song;
};

export const getArtistSongs = async (artistId) => {
  const songs = await Song.find({ artistId }).sort({ createdAt: -1 });
  return songs;
};

// Admin services
export const adminGetAllSongs = async () => {
  const songs = await Song.find().sort({ createdAt: -1 });
  return songs;
};

export const adminToggleVisible = async (songId) => {
  const song = await Song.findById(songId);
  
  if (!song) {
    throw new Error("Song not found");
  }

  song.isVisible = !song.isVisible;
  await song.save();
  return song;
};