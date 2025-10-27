import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { albumService } from "../services/albumService";
import { usePlayerStore } from "../store/usePlayerStore";
import { useAuthStore } from "../store/useAuthStore";
import { Play, Clock, ArrowLeft, Trash2 } from "lucide-react";
import { formatTime } from "../utils/formatTime";
import Button from "../components/common/Button";
import toast from "react-hot-toast";
import { useColorExtractor } from "../hooks/useColorExtractor";

const AlbumDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueue } = usePlayerStore();

  // Extract colors from album art
  const colors = useColorExtractor(album?.imageUrl);

  const isOwner = album?.creatorId === user?._id.toString();

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const data = await albumService.getAlbumById(id);
      setAlbum(data);
    } catch (error) {
      console.error("Error fetching album:", error);
      toast.error("Failed to load album");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (album?.songs && album.songs.length > 0) {
      setQueue(album.songs, 0);
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!confirm("Remove this song from the playlist?")) return;

    try {
      await albumService.removeSongFromAlbum(id, songId);
      setAlbum({
        ...album,
        songs: album.songs.filter((s) => s._id !== songId),
        songIds: album.songIds.filter((sid) => sid !== songId),
      });
      toast.success("Song removed");
    } catch (error) {
      toast.error("Failed to remove song");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading album...</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Album not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen -m-8">
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

        <div className="relative px-8 pt-6 pb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white mb-6 transition control-button"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Album Header */}
          <div className="flex items-end space-x-6 mb-8">
            <div className="relative flex-shrink-0">
              <img
                src={album.imageUrl}
                alt={album.title}
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg shadow-2xl"
                style={{
                  boxShadow: `0 25px 50px -12px ${colors.vibrant}60`,
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold uppercase text-gray-300 mb-2">
                {album.isPublic ? "Album" : "Playlist"}
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 truncate">
                {album.title}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span className="font-medium hover:underline cursor-pointer">
                  {album.creatorName}
                </span>
                <span>•</span>
                <span>{album.songs?.length || 0} songs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        className="px-8 py-6"
        style={{
          background: `linear-gradient(180deg, rgba(18,18,18,0.6) 0%, #121212 20%)`,
        }}
      >
        {/* Play Button */}
        {album.songs && album.songs.length > 0 && (
          <div className="mb-6">
            <Button onClick={handlePlayAll} size="lg">
              <Play size={20} className="mr-2" />
              Play All
            </Button>
          </div>
        )}

        {/* Songs Table */}
        <div className="bg-transparent">
          <div className="px-4 py-2 border-b border-white/10">
            <div className="grid grid-cols-12 gap-4 text-xs text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-5 sm:col-span-6">Title</div>
              <div className="hidden sm:block col-span-3">Artist</div>
              <div className="col-span-2 sm:col-span-1 text-right">
                <Clock size={16} className="inline" />
              </div>
              {isOwner && (
                <div className="col-span-4 sm:col-span-1 text-right">
                  Actions
                </div>
              )}
            </div>
          </div>

          <div>
            {album.songs && album.songs.length > 0 ? (
              album.songs.map((song, index) => {
                return (
                  <div
                    key={song._id}
                    className={`group px-4 py-3 rounded-md hover:bg-white/10 cursor-pointer transition `}
                    onClick={() => setQueue(album.songs, index)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 text-gray-400">
                        <span className={"group-hover:hidden"}>
                          {index + 1}
                        </span>
                        <Play
                          size={16}
                          className="text-primary hidden group-hover:block"
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-6 flex items-center space-x-3 min-w-0">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-medium">{song.title}</span>
                          <p className="text-sm text-gray-400 truncate sm:hidden">
                            {song.artistName}
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:block col-span-3 text-gray-400 truncate">
                        {song.artistName}
                      </div>

                      <div className="col-span-2 sm:col-span-1 text-right text-gray-400 text-sm">
                        {formatTime(song.duration)}
                      </div>

                      {isOwner && (
                        <div className="col-span-4 sm:col-span-1 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSong(song._id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-gray-400">
                <p className="text-lg mb-2">
                  No songs in this {album.isPublic ? "album" : "playlist"} yet
                </p>
                <p className="text-sm">Add some songs to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailPage;
