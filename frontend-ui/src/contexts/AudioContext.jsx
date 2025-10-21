import { createContext, useContext, useRef, useState, useEffect } from "react";

const AudioContextContext = createContext(null);

export const AudioContextProvider = ({ children }) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAudioContext = (audioElement) => {
    if (isInitialized || !audioElement) return;

    try {
      // Create audio context and analyser
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      // Create source from audio element (ONLY ONCE)
      sourceRef.current =
        audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      // Configure analyser
      analyserRef.current.fftSize = 512;

      setIsInitialized(true);
      console.log("Audio context initialized successfully");
    } catch (error) {
      console.error("Error initializing audio context:", error);
    }
  };

  const getAnalyserData = () => {
    if (!analyserRef.current) return null;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    return dataArray;
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
    };
  }, []);

  return (
    <AudioContextContext.Provider
      value={{
        audioContext: audioContextRef.current,
        analyser: analyserRef.current,
        isInitialized,
        initializeAudioContext,
        getAnalyserData,
      }}
    >
      {children}
    </AudioContextContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContextContext);
  if (!context) {
    throw new Error("useAudioContext must be used within AudioContextProvider");
  }
  return context;
};
