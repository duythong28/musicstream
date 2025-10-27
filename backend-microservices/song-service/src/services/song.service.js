import {
  uploadToCloudinary,
  generateStreamingUrl,
  extractPublicId,
} from "../config/cloudinary.config.js";
import { Song } from "../models/song.model.js";
import {
  cacheGet,
  cacheSet,
  cacheDel,
  cacheInvalidatePattern,
} from "../config/redis.js";
import * as recombeeService from "./recombee.service.js";

// Cache TTL settings
const CACHE_TTL = {
  ALL_SONGS: 300, // 5 minutes
  SINGLE_SONG: 600, // 10 minutes
  ARTIST_SONGS: 300, // 5 minutes
};

export const getAllSongs = async () => {
  // Try cache first
  const cacheKey = "songs:all:public";
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log("Cache HIT: All songs");
    return cached;
  }

  console.log("Cache MISS: All songs");
  const songs = await Song.find({ isPublic: true, isVisible: true }).sort({
    createdAt: -1,
  });

  // Add streaming URLs
  const songsWithStreaming = songs.map((song) => {
    const songObj = song.toObject();

    // Extract Cloudinary public_id from audioUrl
    const publicId = extractPublicId(songObj.audioUrl);

    if (publicId) {
      songObj.streamingUrls = {
        low: generateStreamingUrl(publicId, { bitrate: "64k" }),
        medium: generateStreamingUrl(publicId, { bitrate: "128k" }),
        high: generateStreamingUrl(publicId, { bitrate: "320k" }),
      };
    }

    return songObj;
  });

  // Cache the result
  await cacheSet(cacheKey, songsWithStreaming, CACHE_TTL.ALL_SONGS);

  return songsWithStreaming;
};

export const getSongById = async (songId) => {
  const cacheKey = `song:${songId}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log(`Cache HIT: Song ${songId}`);
    return cached;
  }

  console.log(`Cache MISS: Song ${songId}`);
  const song = await Song.findById(songId);
  if (!song) {
    throw new Error("Song not found");
  }

  const songObj = song.toObject();

  const publicId = extractPublicId(songObj.audioUrl);

  if (publicId) {
    songObj.streamingUrls = {
      low: generateStreamingUrl(publicId, { bitrate: "64k" }),
      medium: generateStreamingUrl(publicId, { bitrate: "128k" }),
      high: generateStreamingUrl(publicId, { bitrate: "320k" }),
    };
  }

  await cacheSet(cacheKey, songObj, CACHE_TTL.SINGLE_SONG);
  return songObj;
};

export const getSongsByIds = async (songIds) => {
  const songs = await Song.find({ _id: { $in: songIds } });
  return songs.map((song) => {
    const songObj = song.toObject();
    const publicId = extractPublicId(songObj.audioUrl);

    if (publicId) {
      songObj.streamingUrls = {
        low: generateStreamingUrl(publicId, { bitrate: "64k" }),
        medium: generateStreamingUrl(publicId, { bitrate: "128k" }),
        high: generateStreamingUrl(publicId, { bitrate: "320k" }),
      };
    }

    return songObj;
  });
};

export const createSong = async (body, files, user) => {
  if (user.role !== "artist" && user.role !== "admin") {
    throw new Error("Only artists can upload songs");
  }
  if (!files || !files.image || !files.audio) {
    throw new Error("Both an image and an audio file are required.");
  }

  const [imageUploadResult, audioUploadResult] = await Promise.all([
    uploadToCloudinary(files.image[0].buffer, { resource_type: "image" }),
    uploadToCloudinary(files.audio[0].buffer, { resource_type: "video" }),
  ]);

  if (!imageUploadResult?.secure_url || !audioUploadResult?.secure_url) {
    throw new Error("Cloudinary upload failed.");
  }

  const duration = Math.round(audioUploadResult.duration);
  const { title, albumId } = body;

  const newSong = new Song({
    title,
    albumId: albumId || null,
    artistId: user._id.toString(),
    artistName: user.fullName,
    imageUrl: imageUploadResult.secure_url,
    audioUrl: audioUploadResult.secure_url,
    duration: duration,
    isPublic: true,
    isVisible: true,
  });

  await newSong.save();

  // Add to Recombee
  await recombeeService.addSongToRecombee(newSong);

  // Invalidate caches
  await cacheInvalidatePattern("songs:*");
  await cacheInvalidatePattern(`artist:${user._id}:*`);

  return newSong;
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

  // Invalidate caches
  await cacheDel(`song:${songId}`);
  await cacheInvalidatePattern("songs:*");
  await cacheInvalidatePattern(`artist:${song.artistId}:*`);

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

  // Remove from Recombee
  await recombeeService.deleteSongFromRecombee(songId);

  // Invalidate caches
  await cacheDel(`song:${songId}`);
  await cacheInvalidatePattern("songs:*");
  await cacheInvalidatePattern(`artist:${song.artistId}:*`);

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

  // Invalidate caches
  await cacheDel(`song:${songId}`);
  await cacheInvalidatePattern("songs:*");

  return song;
};

export const getArtistSongs = async (artistId) => {
  const cacheKey = `artist:${artistId}:songs`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log(`Cache HIT: Artist ${artistId} songs`);
    return cached;
  }

  console.log(`Cache MISS: Artist ${artistId} songs`);
  const songs = await Song.find({ artistId }).sort({ createdAt: -1 });

  await cacheSet(cacheKey, songs, CACHE_TTL.ARTIST_SONGS);
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

  // Invalidate caches
  await cacheDel(`song:${songId}`);
  await cacheInvalidatePattern("songs:*");

  return song;
};
// Track song play with Recombee
export const trackSongPlay = async (songId, userId) => {
  try {
    await recombeeService.trackInteraction(userId, songId, "play");

    // Invalidate user's recommendations cache
    await cacheDel(`recommendations:user:${userId}`);

    return true;
  } catch (error) {
    console.error("Error tracking song play:", error);
    return false;
  }
};

// Track song completion
export const trackSongComplete = async (songId, userId) => {
  try {
    await recombeeService.trackInteraction(userId, songId, "complete");
    await cacheDel(`recommendations:user:${userId}`);
    return true;
  } catch (error) {
    console.error("Error tracking song complete:", error);
    return false;
  }
};

// Track song skip
export const trackSongSkip = async (songId, userId) => {
  try {
    await recombeeService.trackInteraction(userId, songId, "skip");
    await cacheDel(`recommendations:user:${userId}`);
    return true;
  } catch (error) {
    console.error("Error tracking song skip:", error);
    return false;
  }
};

// Get personalized recommendations for user
export const getPersonalizedRecommendations = async (userId, count = 10) => {
  const cacheKey = `recommendations:user:${userId}`;
  const cached = await cacheGet(cacheKey);

  if (cached) {
    console.log(`Cache HIT: Recommendations for user ${userId}`);
    return cached;
  }

  console.log(`Cache MISS: Recommendations for user ${userId}`);

  try {
    // Get recommendations from Recombee
    const recommendations = await recombeeService.getRecommendations(
      userId,
      count
    );

    if (recommendations.length === 0) {
      // Fallback to trending if no personalized recommendations
      return getTrendingSongs(count);
    }

    // Fetch full song details from database
    const songIds = recommendations.map((r) => r.songId);
    const songs = await Song.find({
      _id: { $in: songIds },
      isPublic: true,
      isVisible: true,
    });

    // Add streaming URLs
    const songsWithStreaming = songs.map((song) => {
      const songObj = song.toObject();
      const publicId = extractPublicId(songObj.audioUrl);

      if (publicId) {
        songObj.streamingUrls = {
          low: generateStreamingUrl(publicId, { bitrate: "64k" }),
          medium: generateStreamingUrl(publicId, { bitrate: "128k" }),
          high: generateStreamingUrl(publicId, { bitrate: "320k" }),
        };
      }

      return songObj;
    });

    // Cache recommendations
    await cacheSet(cacheKey, songsWithStreaming, CACHE_TTL.RECOMMENDATIONS);

    return songsWithStreaming;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    // Fallback to trending
    return getTrendingSongs(count);
  }
};

// Get similar songs
export const getSimilarSongs = async (songId, count = 10) => {
  const cacheKey = `recommendations:similar:${songId}`;
  const cached = await cacheGet(cacheKey);

  if (cached) {
    console.log(`Cache HIT: Similar songs for ${songId}`);
    return cached;
  }

  console.log(`Cache MISS: Similar songs for ${songId}`);

  try {
    const recommendations = await recombeeService.getSimilarSongs(
      songId,
      count
    );

    if (recommendations.length === 0) {
      return [];
    }

    // Fetch full song details
    const songIds = recommendations.map((r) => r.songId);
    const songs = await Song.find({
      _id: { $in: songIds },
      isPublic: true,
      isVisible: true,
    });

    // Add streaming URLs
    const songsWithStreaming = songs.map((song) => {
      const songObj = song.toObject();
      const publicId = extractPublicId(songObj.audioUrl);

      if (publicId) {
        songObj.streamingUrls = {
          low: generateStreamingUrl(publicId, { bitrate: "64k" }),
          medium: generateStreamingUrl(publicId, { bitrate: "128k" }),
          high: generateStreamingUrl(publicId, { bitrate: "320k" }),
        };
      }

      return songObj;
    });

    // Cache similar songs
    await cacheSet(cacheKey, songsWithStreaming, CACHE_TTL.RECOMMENDATIONS);

    return songsWithStreaming;
  } catch (error) {
    console.error("Error getting similar songs:", error);
    return [];
  }
};

// Get trending songs
export const getTrendingSongs = async (count = 20) => {
  const cacheKey = "recommendations:trending";
  const cached = await cacheGet(cacheKey);

  if (cached) {
    console.log("Cache HIT: Trending songs");
    return cached;
  }

  console.log("Cache MISS: Trending songs");

  try {
    const recommendations = await recombeeService.getTrendingSongs(count);

    if (recommendations.length === 0) {
      // Fallback to recent songs
      return getAllSongs();
    }

    // Fetch full song details
    const songIds = recommendations.map((r) => r.songId);
    const songs = await Song.find({
      _id: { $in: songIds },
      isPublic: true,
      isVisible: true,
    });

    // Add streaming URLs
    const songsWithStreaming = songs.map((song) => {
      const songObj = song.toObject();
      const publicId = extractPublicId(songObj.audioUrl);

      if (publicId) {
        songObj.streamingUrls = {
          low: generateStreamingUrl(publicId, { bitrate: "64k" }),
          medium: generateStreamingUrl(publicId, { bitrate: "128k" }),
          high: generateStreamingUrl(publicId, { bitrate: "320k" }),
        };
      }

      return songObj;
    });

    // Cache trending songs
    await cacheSet(cacheKey, songsWithStreaming, 300); // 5 minutes TTL

    return songsWithStreaming;
  } catch (error) {
    console.error("Error getting trending songs:", error);
    return getAllSongs();
  }
};
