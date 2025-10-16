import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { albumService } from "../../services/albumService";
import { Plus, Check } from "lucide-react";
import toast from "react-hot-toast";

const AddToPlaylistModal = ({ isOpen, onClose, song }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

  const fetchPlaylists = async () => {
    try {
      const data = await albumService.getMyAlbums();
      setPlaylists(data);
    } catch (error) {
      toast.error("Failed to fetch playlists");
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    setIsLoading(true);
    try {
      await albumService.addSongToAlbum(playlistId, song._id);
      toast.success("Added to playlist!");
      
      // Update playlist in state
      setPlaylists(
        playlists.map((p) =>
          p._id === playlistId
            ? { ...p, songIds: [...p.songIds, song._id] }
            : p
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add song");
    } finally {
      setIsLoading(false);
    }
  };

  const isSongInPlaylist = (playlist) => {
    return playlist.songIds?.includes(song._id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
      <div className="space-y-3">
        {playlists.length > 0 ? (
          playlists.map((playlist) => {
            const inPlaylist = isSongInPlaylist(playlist);
            
            return (
              <div
                key={playlist._id}
                className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg hover:bg-dark-hover transition"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={playlist.imageUrl}
                    alt={playlist.title}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <h4 className="font-medium">{playlist.title}</h4>
                    <p className="text-sm text-gray-400">
                      {playlist.songIds?.length || 0} songs
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => !inPlaylist && handleAddToPlaylist(playlist._id)}
                  disabled={inPlaylist || isLoading}
                  className={`p-2 rounded-full transition ${
                    inPlaylist
                      ? "bg-primary text-black cursor-default"
                      : "bg-white text-black hover:scale-110"
                  }`}
                >
                  {inPlaylist ? <Check size={20} /> : <Plus size={20} />}
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>You don't have any playlists yet.</p>
            <p className="text-sm mt-2">Create a playlist first!</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddToPlaylistModal;