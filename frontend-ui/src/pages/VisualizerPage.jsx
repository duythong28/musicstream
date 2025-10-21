import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../store/usePlayerStore";
import AudioVisualizer from "../components/player/AudioVisualizer";
import VisualizerControls from "../components/player/VisualizerControls";
import { X, Maximize2, Minimize2 } from "lucide-react";

const VisualizerPage = () => {
  const navigate = useNavigate();
  const { currentSong, isPlaying } = usePlayerStore();
  const [visualizerType, setVisualizerType] = useState("bars");
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Request fullscreen on mount
    if (containerRef.current) {
      containerRef.current.requestFullscreen?.();
    }

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate(-1);
  };

  if (!currentSong) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No song is currently playing</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-green-500 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Get audio element from main player

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-dark via-dark-secondary to-dark-tertiary flex flex-col"
    >
      {/* Header Controls */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="w-16 h-16 rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold">{currentSong.title}</h2>
            <p className="text-gray-400">{currentSong.artistName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <VisualizerControls
            type={visualizerType}
            setType={setVisualizerType}
            isVisible={showVisualizer}
            setIsVisible={setShowVisualizer}
          />

          <button
            onClick={toggleFullscreen}
            className="p-3 text-gray-400 hover:text-white transition rounded-lg hover:bg-dark-tertiary"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <button
            onClick={handleClose}
            className="p-3 text-gray-400 hover:text-white transition rounded-lg hover:bg-dark-tertiary"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Visualizer Display */}
      <div className="flex-1 flex items-center justify-center p-8">
        {showVisualizer ? (
          <div className="w-full max-w-6xl h-96">
            <AudioVisualizer type={visualizerType} />
          </div>
        ) : (
          <div className="text-center">
            <img
              src={currentSong.imageUrl}
              alt={currentSong.title}
              className={`w-96 h-96 ${
                isPlaying ? " animate-spin-slow rounded-full" : "rounded-2xl"
              } shadow-2xl mx-auto mb-8`}
            />
            <h1 className="text-4xl font-bold mb-2">{currentSong.title}</h1>
            <p className="text-2xl text-gray-400">{currentSong.artistName}</p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">
          Press ESC to exit fullscreen • Click controls to change visualization
        </p>
      </div>
    </div>
  );
};

export default VisualizerPage;
