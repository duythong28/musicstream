import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { songService } from "../services/songService";
import { usePlayerStore } from "../store/usePlayerStore";
import SimilarSongs from "../components/songs/SimilarSongs";
import { Play, Clock, Calendar, User, ArrowLeft } from "lucide-react";
import { formatTime } from "../utils/formatTime";
import Button from "../components/common/Button";
import { useColorExtractor } from "../hooks/useColorExtractor";

const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentSong } = usePlayerStore();

  // Extract colors from album art
  const colors = useColorExtractor(song?.imageUrl);

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
    <div className="min-h-screen -m-4 sm:-m-6 lg:-m-8">
      {/* Hero Section with Gradient Background */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(180deg, ${colors.dominant} 0%, rgba(18,18,18,0.6) 100%)`,
        }}
      >
        {/* Animated blur overlay */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.vibrant} 0%, transparent 70%)`,
          }}
        />

        <div className="relative px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white mb-4 sm:mb-6 transition control-button touch-manipulation"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Song Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-full sm:w-48 md:w-56 lg:w-64 aspect-square rounded-lg shadow-2xl"
              style={{
                boxShadow: `0 25px 50px -12px ${colors.vibrant}60`,
              }}
            />
            <div className="flex-1 w-full">
              <p className="text-xs sm:text-sm font-semibold uppercase text-gray-400 mb-2">
                Song
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 break-words">
                {song.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-400">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{song.artistName}</span>
                </div>

                {song.genre && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{song.genre}</span>
                  </>
                )}

                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{formatTime(song.duration)}</span>
                </div>

                {song.releaseYear && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{song.releaseYear}</span>
                    </div>
                  </>
                )}
              </div>

              {song.playCount > 0 && (
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                  {song.playCount.toLocaleString()} plays
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        style={{
          background: `linear-gradient(180deg, rgba(18,18,18,0.6) 0%, #121212 20%)`,
        }}
      >
        {/* Play Button */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={() => setCurrentSong(song)}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Play size={20} className="mr-2" />
            Play Song
          </Button>
        </div>

        {/* Similar Songs */}
        <SimilarSongs songId={song._id} />
      </div>
    </div>
  );
};

export default SongDetailPage;
