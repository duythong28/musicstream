import Modal from "../common/Modal";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Play, X } from "lucide-react";
import { formatTime } from "../../utils/formatTime";

const QueueModal = ({ isOpen, onClose }) => {
  const { queue, currentIndex, currentSong, setQueue, clearQueue } =
    usePlayerStore();

  const handlePlaySong = (index) => {
    setQueue(queue, index);
  };

  const handleRemoveFromQueue = (index) => {
    const newQueue = queue.filter((_, i) => i !== index);
    const newIndex = index < currentIndex ? currentIndex - 1 : currentIndex;
    setQueue(newQueue, Math.min(newIndex, newQueue.length - 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Queue">
      <div className="space-y-2">
        {/* Now Playing */}
        {currentSong && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              Now Playing
            </h3>
            <div className="flex items-center space-x-3 p-3 bg-primary/20 rounded-lg">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{currentSong.title}</h4>
                <p className="text-sm text-gray-400">
                  {currentSong.artistName}
                </p>
              </div>
              <span className="text-sm text-gray-400">
                {formatTime(currentSong.duration)}
              </span>
            </div>
          </div>
        )}

        {/* Queue */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400">
              Next in Queue ({Math.max(0, queue.length - currentIndex - 1)})
            </h3>
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="text-xs text-red-500 hover:text-red-400 transition"
              >
                Clear Queue
              </button>
            )}
          </div>

          {queue.length > 0 ? (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {queue.map((song, index) => {
                if (index <= currentIndex) return null;

                return (
                  <div
                    key={`${song._id}-${index}`}
                    className="flex items-center space-x-3 p-2 hover:bg-dark-tertiary rounded-lg group"
                  >
                    <button
                      onClick={() => handlePlaySong(index)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Play size={16} className="text-primary" />
                    </button>
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate text-sm">
                        {song.title}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        {song.artistName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTime(song.duration)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromQueue(index)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Queue is empty</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default QueueModal;
