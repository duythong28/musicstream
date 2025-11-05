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
  MoreHorizontal,
} from "lucide-react";
import { formatTime } from "../../utils/formatTime";
import QueueModal from "../player/QueueModal";
import AudioVisualizer from "../player/AudioVisualizer";
import VisualizerControls from "../player/VisualizerControls";
import QualitySelector from "../player/QualitySelector";
import { useAudioContext } from "../../contexts/AudioContext";
import { recommendationService } from "../../services/recommendationService";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const preloadAudioRef = useRef(null);
  const navigate = useNavigate();
  const [showQueue, setShowQueue] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [visualizerType, setVisualizerType] = useState("bars");
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [isLoadingQuality, setIsLoadingQuality] = useState(false);
  const { initializeAudioContext, isInitialized } = useAudioContext();
  const hasTrackedPlayRef = useRef(false);
  const hasTrackedCompleteRef = useRef(false);
  const lastSongIdRef = useRef(null);

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

  // Keyboard shortcut: Space for Play/Pause
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault(); // Prevent page scroll
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [togglePlay]);

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

  // Reset tracking when song changes
  useEffect(() => {
    if (currentSong && currentSong._id !== lastSongIdRef.current) {
      hasTrackedPlayRef.current = false;
      hasTrackedCompleteRef.current = false;
      lastSongIdRef.current = currentSong._id;
    }
  }, [currentSong?._id]);

  // Handle time update with tracking logic
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    if (
      !currentSong ||
      !isPlaying ||
      (currentSong && currentSong?._id !== lastSongIdRef.current)
    )
      return;

    // Track play after 3 seconds of listening
    if (time > 3 && !hasTrackedPlayRef.current) {
      recommendationService.trackPlay(currentSong._id);
      hasTrackedPlayRef.current = true;
    }

    // Track completion when user listens to 80%+ of song
    if (duration > 0 && !hasTrackedCompleteRef.current) {
      const completionPercentage = (time / duration) * 100;
      if (completionPercentage >= 80) {
        recommendationService.trackComplete(currentSong._id);
        hasTrackedCompleteRef.current = true;
      }
    }
  };

  // Track skip when moving to next song before 50% completion
  const handleNext = () => {
    if (currentSong && duration > 0) {
      const completionPercentage = (currentTime / duration) * 100;
      if (completionPercentage < 50 && hasTrackedPlayRef.current) {
        recommendationService.trackSkip(currentSong._id);
      }
    }
    playNext();
  };

  const handlePrevious = () => {
    if (currentSong && duration > 0) {
      const completionPercentage = (currentTime / duration) * 100;
      if (
        completionPercentage < 50 &&
        hasTrackedPlayRef.current &&
        currentTime > 3
      ) {
        recommendationService.trackSkip(currentSong._id);
      }
    }
    playPrevious();
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
        onLoadedMetadata={(e) => {
          if (audioRef.current) {
            usePlayerStore.setState({ duration: e.target.duration });
          }
        }}
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

      <div className="px-3 sm:px-4 py-2 sm:py-3">
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-[10px] sm:text-xs text-gray-400 w-10 sm:w-12 text-right">
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
          <span className="text-[10px] sm:text-xs text-gray-400 w-10 sm:w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
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

          {/* Controls - Center */}
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
              onClick={handlePrevious}
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
              onClick={handleNext}
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

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-center gap-2 relative">
            {/* Album Art - Left */}
            <img
              src={currentSong.imageUrl}
              alt={currentSong.title}
              className="absolute left-0 w-12 h-12 rounded-lg cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate("/visualizer")}
              title={`${currentSong.title} - ${currentSong.artistName}`}
            />

            {/* Main Controls - Center */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handlePrevious}
                className="text-gray-400 hover:text-white transition p-2"
              >
                <SkipBack size={22} />
              </button>

              <button
                onClick={togglePlay}
                className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-full hover:scale-105 transition"
              >
                {isPlaying ? (
                  <Pause size={22} className="text-black" />
                ) : (
                  <Play size={22} className="text-black ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="text-gray-400 hover:text-white transition p-2"
              >
                <SkipForward size={22} />
              </button>
            </div>

            {/* More Options - Right */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="absolute right-0 text-gray-400 hover:text-white transition p-2"
            >
              <MoreHorizontal size={22} />
            </button>
          </div>

          {/* Mobile Expanded Controls */}
          {showMobileMenu && (
            <div className="mt-3 pt-3 border-t border-dark-tertiary space-y-3">
              {/* Playback Options */}
              <div className="flex items-center justify-around">
                <button
                  onClick={toggleShuffle}
                  className={`flex flex-col items-center space-y-1 ${
                    shuffle ? "text-primary" : "text-gray-400"
                  } hover:text-white transition p-2`}
                >
                  <Shuffle size={20} />
                  <span className="text-[10px]">Shuffle</span>
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`flex flex-col items-center space-y-1 ${
                    repeat ? "text-primary" : "text-gray-400"
                  } hover:text-white transition p-2`}
                >
                  <Repeat size={20} />
                  <span className="text-[10px]">Repeat</span>
                </button>

                <button
                  onClick={() => setShowQueue(true)}
                  className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition p-2"
                >
                  <ListMusic size={20} />
                  <span className="text-[10px]">Queue</span>
                </button>

                <button
                  onClick={() => setShowVisualizer(!showVisualizer)}
                  className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition p-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 3h2v14H3V3zm4 4h2v10H7V7zm4-2h2v12h-2V5zm4 4h2v8h-2V9z" />
                  </svg>
                  <span className="text-[10px]">Visualizer</span>
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3 bg-dark-tertiary rounded-lg p-3">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                  className="text-gray-400 hover:text-white transition"
                >
                  {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 volume-slider"
                  style={{
                    "--volume": `${volume * 100}%`,
                  }}
                />
                <span className="text-xs text-gray-400 w-10 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Quality Selector - Mobile Version */}
              {hasStreamingUrls && (
                <div className="bg-dark-tertiary rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-300">
                      Audio Quality
                    </span>
                    <span className="text-xs text-gray-400">
                      {getQualityLabel()}
                    </span>
                  </div>

                  {/* Auto Quality Toggle */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Auto Quality</span>
                    <button
                      onClick={toggleAutoQuality}
                      className={`relative w-11 h-6 rounded-full transition ${
                        autoQuality ? "bg-primary" : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transform transition ${
                          autoQuality ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Quality Buttons */}
                  {!autoQuality && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeQuality("low")}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                          quality === "low"
                            ? "bg-primary text-black"
                            : "bg-dark-secondary text-gray-300 hover:bg-dark-hover"
                        }`}
                      >
                        Low
                      </button>
                      <button
                        onClick={() => changeQuality("medium")}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                          quality === "medium"
                            ? "bg-primary text-black"
                            : "bg-dark-secondary text-gray-300 hover:bg-dark-hover"
                        }`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => changeQuality("high")}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                          quality === "high"
                            ? "bg-primary text-black"
                            : "bg-dark-secondary text-gray-300 hover:bg-dark-hover"
                        }`}
                      >
                        High
                      </button>
                    </div>
                  )}

                  {autoQuality && (
                    <div className="text-xs text-gray-400 text-center">
                      Network: {getNetworkLabel()}
                    </div>
                  )}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-full py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
};

export default AudioPlayer;
