import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { songService } from "../services/songService";
import { usePlayerStore } from "../store/usePlayerStore";
import SimilarSongs from "../components/songs/SimilarSongs";
import { Play, Clock, Calendar, User, ArrowLeft } from "lucide-react";
import { formatTime } from "../utils/formatTime";
import Button from "../components/common/Button";

const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentSong } = usePlayerStore();

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    try {
      const data = await songService.getSongById(id);
      setSong(data);
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading song...</p>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Song not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Song Header */}
      <div className="flex items-end space-x-6 mb-8">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-64 h-64 rounded-lg shadow-2xl"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase text-gray-400 mb-2">
            Song
          </p>
          <h1 className="text-6xl font-bold mb-4">{song.title}</h1>

          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span>{song.artistName}</span>
            </div>

            {song.genre && (
              <div className="flex items-center space-x-2">
                <span>•</span>
                <span>{song.genre}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>{formatTime(song.duration)}</span>
            </div>

            {song.releaseYear && (
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{song.releaseYear}</span>
              </div>
            )}
          </div>

          {song.playCount > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              {song.playCount.toLocaleString()} plays
            </div>
          )}
        </div>
      </div>

      {/* Play Button */}
      <div className="mb-8">
        <Button onClick={() => setCurrentSong(song)} size="lg">
          <Play size={20} className="mr-2" />
          Play Song
        </Button>
      </div>

      {/* Similar Songs */}
      <SimilarSongs songId={song._id} />
    </div>
  );
};

export default SongDetailPage;
