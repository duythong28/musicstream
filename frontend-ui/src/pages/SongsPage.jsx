import { useEffect, useState } from "react";
import { useSongStore } from "../store/useSongStore";
import SongList from "../components/songs/SongList";

const SongsPage = () => {
  const { songs, isLoading, fetchSongs } = useSongStore();

  useEffect(() => {
    fetchSongs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Songs</h1>
        <p className="text-gray-400">
          {songs.length} song{songs.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <SongList songs={songs} emptyMessage="No songs available yet" />
    </div>
  );
};

export default SongsPage;