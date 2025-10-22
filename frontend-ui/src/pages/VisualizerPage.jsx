import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../store/usePlayerStore";
import { useColorExtractor } from "../hooks/useColorExtractor";
import AudioVisualizer from "../components/player/AudioVisualizer";
import VisualizerControls from "../components/player/VisualizerControls";
import {
  X,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from "lucide-react";
import { formatTime } from "../utils/formatTime";
import { useAudioContext } from "../contexts/AudioContext";

const VisualizerPage = () => {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    repeat,
    shuffle,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    setCurrentTime,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();
  const { audioElement } = useAudioContext();

  const [visualizerType, setVisualizerType] = useState("bars");
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Extract colors from album art
  const colors = useColorExtractor(currentSong?.imageUrl);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen?.();
    }

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
  }, [navigate]);

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

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioElement && !isNaN(time)) {
      audioElement.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
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

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: showVisualizer
          ? "#121212"
          : `radial-gradient(ellipse at top, ${colors.dominant} 0%, #121212 50%, #000000 100%)`,
      }}
    >
      {/* Animated background blur */}
      {!showVisualizer && (
        <div
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.vibrant} 0%, transparent 70%)`,
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
      )}

      {/* Header Controls */}
      <div
        className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 transition-all duration-300 opacity-100 translate-y-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      >
        <div className="flex items-center space-x-3 sm:space-x-4 song-info">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-2xl album-art"
          />
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold truncate">
              {currentSong.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 truncate">
              {currentSong.artistName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <VisualizerControls
            type={visualizerType}
            setType={setVisualizerType}
            isVisible={showVisualizer}
            setIsVisible={setShowVisualizer}
          />

          <button
            onClick={toggleFullscreen}
            className="p-2 sm:p-3 text-gray-300 hover:text-white transition rounded-lg hover:bg-white/10 control-button"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <button
            onClick={handleClose}
            className="p-2 sm:p-3 text-gray-300 hover:text-white transition rounded-lg hover:bg-white/10 control-button"
            title="Close (ESC)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Visualizer Display */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        {showVisualizer ? (
          <div className="w-full max-w-6xl h-[300px] sm:h-[500px] visualizer-container rounded-2xl">
            <AudioVisualizer type={visualizerType} />
          </div>
        ) : (
          <div className="text-center">
            <div className="relative inline-block mb-6 sm:mb-8">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className={`w-64 h-64 sm:w-96 sm:h-96 ${
                  isPlaying ? "animate-spin-slow rounded-full" : "rounded-2xl"
                } shadow-2xl mx-auto`}
                style={{
                  boxShadow: `0 25px 50px -12px ${colors.vibrant}40`,
                }}
              />
              {isPlaying && (
                <div
                  className="absolute inset-0 rounded-full opacity-20 blur-2xl animate-glow"
                  style={{ background: colors.vibrant }}
                />
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4">
              {currentSong.title}
            </h1>
            <p className="text-xl sm:text-3xl text-gray-300">
              {currentSong.artistName}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-20 transition-all duration-300 opacity-100 translate-y-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)",
        }}
      >
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="text-xs text-gray-400 w-12 text-right font-mono">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative group">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-transparent appearance-none cursor-pointer rounded-full"
                style={{
                  background: `linear-gradient(to right, ${
                    colors.vibrant
                  } 0%, ${colors.vibrant} ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(255,255,255,0.2) ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>
            <span className="text-xs text-gray-400 w-12 font-mono">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between max-w-6xl mx-auto gap-6">
          {/* Left: Shuffle & Volume */}
          <div className="flex items-center justify-end flex-1">
            <button
              onClick={toggleShuffle}
              className={`${
                shuffle ? "text-primary" : "text-gray-400"
              } hover:text-white transition control-button p-2 rounded-lg hover:bg-white/10`}
              title={shuffle ? "Shuffle: On" : "Shuffle: Off"}
            >
              <Shuffle size={20} />
            </button>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center space-x-6">
            <button
              onClick={playPrevious}
              className="text-gray-400 hover:text-white transition control-button"
              title="Previous"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white rounded-full hover:scale-105 transition shadow-2xl play-button"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={24} className="text-black sm:w-8 sm:h-8" />
              ) : (
                <Play size={24} className="text-black ml-1 sm:w-8 sm:h-8" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white transition control-button"
              title="Next"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Right: Repeat */}
          <div className="flex items-center justify-between flex-1">
            <button
              onClick={toggleRepeat}
              className={`${
                repeat ? "text-primary" : "text-gray-400"
              } hover:text-white transition control-button p-2 rounded-lg hover:bg-white/10`}
              title={repeat ? "Repeat: On" : "Repeat: Off"}
            >
              <Repeat size={20} />
            </button>
            <div className="hidden sm:flex flex-row items-center space-x-2">
              <Volume2 size={20} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-[100px]"
                style={{
                  background: `linear-gradient(to right, ${
                    colors.vibrant
                  } 0%, ${colors.vibrant} ${
                    volume * 100
                  }%, rgba(255,255,255,0.2) ${
                    volume * 100
                  }%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-400">
            <span className="hidden sm:inline">
              Press ESC to exit • Space to play/pause
            </span>
            <span className="sm:hidden">Tap to show controls</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualizerPage;
