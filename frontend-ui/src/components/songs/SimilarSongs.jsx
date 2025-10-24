import { useEffect, useState } from "react";
import { recommendationService } from "../../services/recommendationService";
import SongCard from "./SongCard";
import { Music4 } from "lucide-react";

const SimilarSongs = ({ songId }) => {
  const [similarSongs, setSimilarSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (songId) {
      fetchSimilarSongs();
    }
  }, [songId]);

  const fetchSimilarSongs = async () => {
    try {
      const songs = await recommendationService.getSimilarSongs(songId, 8);
      setSimilarSongs(songs);
    } catch (error) {
      console.error("Error fetching similar songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-dark-tertiary rounded w-48"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-dark-tertiary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (similarSongs.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center space-x-2 mb-6">
        <Music4 className="text-primary" size={24} />
        <h2 className="text-2xl font-bold">You Might Also Like</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {similarSongs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default SimilarSongs;