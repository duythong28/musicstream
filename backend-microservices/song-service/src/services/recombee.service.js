import recombee from "recombee-api-client";

const client = new recombee.ApiClient(
  process.env.RECOMBEE_DATABASE_ID,
  process.env.RECOMBEE_PRIVATE_TOKEN,
  { region: process.env.RECOMBEE_REGION || "us-west" }
);

// Initialize Recombee database with properties (matching existing schema)
export const initializeRecombee = async () => {
  try {
    console.log("🔧 Initializing Recombee...");

    // Item properties (songs) - only fields from existing schema
    const itemProperties = [
      new recombee.requests.AddItemProperty("title", "string"),
      new recombee.requests.AddItemProperty("artist", "string"),
      new recombee.requests.AddItemProperty("duration", "int"),
      new recombee.requests.AddItemProperty("albumId", "string"),
    ];

    // User properties
    const userProperties = [
      new recombee.requests.AddUserProperty("role", "string"),
    ];

    // Send batch request
    const requests = [...itemProperties, ...userProperties];

    await client.send(new recombee.requests.Batch(requests)).catch((err) => {
      // Ignore errors if properties already exist
      if (!err.message.includes("already exists")) {
        throw err;
      }
    });

    console.log("✅ Recombee initialized successfully");
  } catch (error) {
    console.error("❌ Recombee initialization error:", error.message);
  }
};

// Add or update song in Recombee (using existing schema fields only)
export const addSongToRecombee = async (song) => {
  try {
    const itemId = song._id.toString();

    await client.send(
      new recombee.requests.SetItemValues(
        itemId,
        {
          title: song.title,
          artist: song.artistName,
          duration: song.duration,
          albumId: song.albumId || "none",
        },
        { cascadeCreate: true }
      )
    );

    console.log(`✅ Song added to Recombee: ${song.title}`);
    return true;
  } catch (error) {
    console.error("Recombee add song error:", error.message);
    return false;
  }
};

// Track user interaction (view, play, like, etc.)
export const trackInteraction = async (
  userId,
  songId,
  interactionType = "detail"
) => {
  try {
    let request;

    switch (interactionType) {
      case "play":
        // Use DetailView for play tracking
        request = new recombee.requests.AddDetailView(userId, songId, {
          cascadeCreate: true,
          timestamp: new Date().toISOString(),
        });
        break;
      case "complete":
        // Use Purchase for completion (strongest positive signal)
        request = new recombee.requests.AddPurchase(userId, songId, {
          cascadeCreate: true,
          timestamp: new Date().toISOString(),
        });
        break;
      case "skip":
        // Use negative Rating for skips
        request = new recombee.requests.AddRating(userId, songId, -0.5, {
          cascadeCreate: true,
          timestamp: new Date().toISOString(),
        });
        break;
      case "like":
        // Use positive Rating for likes
        request = new recombee.requests.AddRating(userId, songId, 1, {
          cascadeCreate: true,
          timestamp: new Date().toISOString(),
        });
        break;
      default:
        request = new recombee.requests.AddDetailView(userId, songId, {
          cascadeCreate: true,
          timestamp: new Date().toISOString(),
        });
    }

    await client.send(request);
    console.log(
      `✅ Tracked ${interactionType} for user ${userId} on song ${songId}`
    );
    return true;
  } catch (error) {
    console.error("Recombee track interaction error:", error.message);
    return false;
  }
};

// Get personalized recommendations for a user
export const getRecommendations = async (userId, count = 10, options = {}) => {
  try {
    const request = new recombee.requests.RecommendItemsToUser(userId, count, {
      scenario: options.scenario || "homepage",
      cascadeCreate: true,
      returnProperties: true,
      includedProperties: ["title", "artist", "duration", "albumId"],
      filter: options.filter,
      booster: options.booster,
      diversity: options.diversity || 0.1,
      minRelevance: "low",
    });

    const response = await client.send(request);

    console.log(
      `✅ Got ${response.recomms.length} recommendations for user ${userId}`
    );
    return response.recomms.map((r) => ({
      songId: r.id,
      ...r.values,
    }));
  } catch (error) {
    console.error("Recombee get recommendations error:", error.message);
    return [];
  }
};

// Get similar items (songs like this)
export const getSimilarSongs = async (
  songId,
  count = 10,
  targetUserId = null
) => {
  try {
    // Use the user ID if provided, otherwise use a generic ID
    const userId = targetUserId || `similar-${songId}`;

    const request = new recombee.requests.RecommendItemsToItem(
      songId,
      userId,
      count,
      {
        scenario: "similar-songs",
        cascadeCreate: true,
        returnProperties: true,
        includedProperties: ["title", "artist", "duration", "albumId"],
        diversity: 0.2,
        minRelevance: "low",
      }
    );

    const response = await client.send(request);

    console.log(
      `✅ Got ${response.recomms.length} similar songs for ${songId}`
    );
    return response.recomms.map((r) => ({
      songId: r.id,
      ...r.values,
    }));
  } catch (error) {
    console.error("Recombee get similar songs error:", error.message);
    return [];
  }
};

// Get trending songs based on interactions
export const getTrendingSongs = async (count = 20) => {
  try {
    const request = new recombee.requests.RecommendItemsToUser(
      "trending-user", // Special user for trending
      count,
      {
        scenario: "trending",
        cascadeCreate: true,
        returnProperties: true,
        includedProperties: ["title", "artist", "duration", "albumId"],
        // Boost items with more recent interactions
        logic: {
          name: "weighted-random",
          parameters: {
            halfLife: 7 * 24 * 3600, // 7 days
          },
        },
        minRelevance: "low",
      }
    );

    const response = await client.send(request);
    return response.recomms.map((r) => ({
      songId: r.id,
      ...r.values,
    }));
  } catch (error) {
    console.error("Recombee get trending error:", error.message);
    return [];
  }
};

// Delete song from Recombee
export const deleteSongFromRecombee = async (songId) => {
  try {
    await client.send(new recombee.requests.DeleteItem(songId));
    console.log(`✅ Song deleted from Recombee: ${songId}`);
    return true;
  } catch (error) {
    console.error("Recombee delete song error:", error.message);
    return false;
  }
};

// Batch update songs
export const batchUpdateSongs = async (songs) => {
  try {
    const requests = songs.map((song) => {
      return new recombee.requests.SetItemValues(
        song._id.toString(),
        {
          title: song.title,
          artist: song.artistName,
          duration: song.duration,
          albumId: song.albumId || "none",
        },
        { cascadeCreate: true }
      );
    });

    await client.send(new recombee.requests.Batch(requests));
    console.log(`✅ Batch updated ${songs.length} songs in Recombee`);
    return true;
  } catch (error) {
    console.error("Recombee batch update error:", error.message);
    return false;
  }
};

export default {
  initializeRecombee,
  addSongToRecombee,
  trackInteraction,
  getRecommendations,
  getSimilarSongs,
  getTrendingSongs,
  deleteSongFromRecombee,
  batchUpdateSongs,
};
