import mongoose from "mongoose";
import { Song } from "../src/models/song.model.js";
import { batchUpdateSongs } from "../src/services/recombee.service.js";

async function migrateSongs() {
  await mongoose.connect(process.env.MONGODB_URI);

  const songs = await Song.find({ isPublic: true, isVisible: true });

  if (!songs || songs.length === 0) {
    console.log("No public and visible songs found to migrate.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${songs.length} songs. Starting migration to Recombee...`);

  try {
    await batchUpdateSongs(songs);

    console.log(`Successfully migrated ${songs.length} songs to Recombee.`);
  } catch (error) {
    console.error("Error during Recombee migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Migration script finished. Database connection closed.");
  }
}

migrateSongs().catch((err) => {
  console.error("Unhandled error running migration script:", err);
  mongoose.disconnect();
  process.exit(1);
});
