import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useAdaptiveStreaming } from "../../hooks/useAdaptiveStreaming";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  ListMusic,
  Maximize2,
} from "lucide-react";
import { formatTime } from "../../utils/formatTime";
import QueueModal from "../player/QueueModal";
import AudioVisualizer from "../player/AudioVisualizer";
import VisualizerControls from "../player/VisualizerControls";
import QualitySelector from "../player/QualitySelector";
import { useAudioContext } from "../../contexts/AudioContext";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const preloadAudioRef = useRef(null);
  const navigate = useNavigate();
  const [showQueue, setShowQueue] = useState(false);
  const [visualizerType, setVisualizerType] = useState("bars");
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [isLoadingQuality, setIsLoadingQuality] = useState(false);
  const { initializeAudioContext, isInitialized } = useAudioContext();

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
    setIsPlaying,
  } = usePlayerStore();

  // Adaptive streaming hook
  const {
    audioUrl,
    quality,
    autoQuality,
    networkSpeed,
    changeQuality,
    toggleAutoQuality,
    getQualityLabel,
    getNetworkLabel,
    hasStreamingUrls,
  } = useAdaptiveStreaming(currentSong);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && audioUrl && !isLoadingQuality) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl, isLoadingQuality]);

  // Initialize audio context when audio element is ready
  useEffect(() => {
    if (audioRef.current && !isInitialized) {
      initializeAudioContext(audioRef.current);
    }
  }, [audioRef.current, isInitialized, initializeAudioContext]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update audio source when URL changes (quality switch or song change)
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;

    if (audioRef.current.src === audioUrl) return;

    setIsLoadingQuality(true);

    // Create or reuse a hidden audio element for preloading
    if (!preloadAudioRef.current) {
      preloadAudioRef.current = document.createElement("audio");
    }
    const preloadAudio = preloadAudioRef.current;
    preloadAudio.src = audioUrl;
    preloadAudio.preload = "auto";
    preloadAudio.currentTime = currentTime;

    const handleCanPlay = () => {
      // Only assign src when preloaded and can play
      audioRef.current.src = audioUrl;
      audioRef.current.currentTime = currentTime;
      audioRef.current.load();
      setIsLoadingQuality(false);
      preloadAudio.removeEventListener("canplay", handleCanPlay);
    };

    preloadAudio.addEventListener("canplay", handleCanPlay);

    preloadAudio.load();

    return () => {
      preloadAudio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioUrl]);

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle song end
  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  // Handle seek
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-secondary border-t border-dark-tertiary">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />

      {/* Visualizer */}
      <div
        className={`h-24 bg-dark border-b border-dark-tertiary ${
          showVisualizer ? "block" : "hidden"
        }`}
      >
        <AudioVisualizer type={visualizerType} />
      </div>

      <div className="px-4 py-3">
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-gray-400 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 progress-slider"
            style={{
              "--progress": `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
          <span className="text-xs text-gray-400 w-12">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1">
            <img
              src={currentSong.imageUrl}
              alt={currentSong.title}
              className="w-14 h-14 rounded-lg cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate("/visualizer")}
              title="Open Fullscreen Visualizer"
            />
            <div className="min-w-0">
              <h4 className="font-semibold">{currentSong.title}</h4>
              <p className="text-sm text-gray-400">{currentSong.artistName}</p>
              {hasStreamingUrls && (
                <p className="text-xs text-gray-500">
                  Quality: {getQualityLabel()}
                  {autoQuality && ` (${getNetworkLabel()})`}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className={`${
                shuffle ? "text-primary" : "text-gray-400"
              } hover:text-white transition`}
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={playPrevious}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause size={24} className="text-black" />
              ) : (
                <Play size={24} className="text-black ml-1" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipForward size={24} />
            </button>

            <button
              onClick={toggleRepeat}
              className={`${
                repeat ? "text-primary" : "text-gray-400"
              } hover:text-white transition`}
            >
              <Repeat size={20} />
            </button>

            <button
              onClick={() => setShowQueue(true)}
              className="text-gray-400 hover:text-white transition"
              title="Queue"
            >
              <ListMusic size={20} />
            </button>
          </div>

          {/* Volume & Visualizer Controls */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <VisualizerControls
              type={visualizerType}
              setType={setVisualizerType}
              isVisible={showVisualizer}
              setIsVisible={setShowVisualizer}
            />

            {/* Quality Selector */}
            <QualitySelector
              quality={quality}
              autoQuality={autoQuality}
              networkSpeed={networkSpeed}
              onQualityChange={changeQuality}
              onToggleAuto={toggleAutoQuality}
              getQualityLabel={getQualityLabel}
              getNetworkLabel={getNetworkLabel}
              hasStreamingUrls={hasStreamingUrls}
            />

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 size={20} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-slider"
                style={{
                  "--volume": `${volume * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
};

export default AudioPlayer;
