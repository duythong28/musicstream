import { useState } from "react";
import { Play, Pause, MoreVertical, ListPlus } from "lucide-react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { formatTime } from "../../utils/formatTime";
import AddToPlaylistModal from "./AddToPlaylistModal";

const SongCard = ({ song, showArtist = true }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;
  const [showMenu, setShowMenu] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <>
      <div className="group bg-dark-tertiary rounded-lg p-4 hover:bg-dark-hover transition-colors cursor-pointer relative">
        <div className="relative mb-4">
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <button
            onClick={handlePlay}
            className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg"
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="text-black" size={24} />
            ) : (
              <Play className="text-black ml-1" size={24} />
            )}
          </button>
        </div>

        {/* More Options */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-secondary rounded-lg shadow-xl border border-dark-tertiary z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddToPlaylist(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-dark-tertiary transition flex items-center space-x-2"
              >
                <ListPlus size={18} />
                <span>Add to playlist</span>
              </button>
            </div>
          )}
        </div>

        <h3 className="font-semibold truncate mb-1">{song.title}</h3>
        {showArtist && (
          <p className="text-sm text-gray-400 truncate">{song.artistName}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {formatTime(song.duration)}
        </p>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}

      <AddToPlaylistModal
        isOpen={showAddToPlaylist}
        onClose={() => setShowAddToPlaylist(false)}
        song={song}
      />
    </>
  );
};

export default SongCard;
