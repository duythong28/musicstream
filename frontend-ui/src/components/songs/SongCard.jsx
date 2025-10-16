import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { formatTime } from "../../utils/formatTime";

const SongCard = ({ song, showArtist = true }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <div className="group bg-dark-tertiary rounded-lg p-4 hover:bg-dark-hover transition-colors cursor-pointer">
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
      
      <h3 className="font-semibold truncate mb-1">{song.title}</h3>
      {showArtist && (
        <p className="text-sm text-gray-400 truncate">{song.artistName}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">{formatTime(song.duration)}</p>
    </div>
  );
};

export default SongCard;