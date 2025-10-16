import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { albumService } from "../services/albumService";
import { usePlayerStore } from "../store/usePlayerStore";
import { Play, Clock, ArrowLeft } from "lucide-react";
import { formatTime } from "../utils/formatTime";
import Button from "../components/common/Button";

const AlbumDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueue } = usePlayerStore();

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const data = await albumService.getAlbumById(id);
      setAlbum(data);
    } catch (error) {
      console.error("Error fetching album:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (album?.songs && album.songs.length > 0) {
      setQueue(album.songs, 0);
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
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Album Header */}
      <div className="flex items-end space-x-6 mb-8">
        <img
          src={album.imageUrl}
          alt={album.title}
          className="w-64 h-64 rounded-lg shadow-2xl"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase text-gray-400 mb-2">
            {album.isPublic ? "Album" : "Playlist"}
          </p>
          <h1 className="text-6xl font-bold mb-4">{album.title}</h1>
          <p className="text-gray-400 mb-4">By {album.creatorName}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{album.songs?.length || 0} songs</span>
          </div>
        </div>
      </div>

      {/* Play Button */}
      {album.songs && album.songs.length > 0 && (
        <div className="mb-8">
          <Button onClick={handlePlayAll} size="lg">
            <Play size={20} className="mr-2" />
            Play All
          </Button>
        </div>
      )}

      {/* Songs Table */}
      <div className="bg-dark-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-dark-tertiary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 w-12">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Artist</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                <Clock size={16} className="inline" />
              </th>
            </tr>
          </thead>
          <tbody>
            {album.songs && album.songs.length > 0 ? (
              album.songs.map((song, index) => (
                <tr
                  key={song._id}
                  className="hover:bg-dark-tertiary cursor-pointer group"
                  onClick={() => setQueue(album.songs, index)}
                >
                  <td className="px-4 py-3">
                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                    <Play size={16} className="text-primary hidden group-hover:block" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded"
                      />
                      <span className="font-medium">{song.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{song.artistName}</td>
                  <td className="px-4 py-3 text-right text-gray-400">
                    {formatTime(song.duration)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                  No songs in this album yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlbumDetailPage;