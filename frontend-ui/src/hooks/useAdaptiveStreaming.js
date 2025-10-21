// frontend/src/hooks/useAdaptiveStreaming.js
import { useState, useEffect, useCallback } from "react";

export const useAdaptiveStreaming = (song) => {
  const [quality, setQuality] = useState("medium"); // low, medium, high
  const [autoQuality, setAutoQuality] = useState(true);
  const [networkSpeed, setNetworkSpeed] = useState("4g"); // slow-2g, 2g, 3g, 4g
  const [audioUrl, setAudioUrl] = useState(null);

  // Detect network speed using Network Information API
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      const updateConnectionInfo = () => {
        const effectiveType = connection.effectiveType;
        setNetworkSpeed(effectiveType);
        
        // Auto-adjust quality based on network
        if (autoQuality) {
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            setQuality('low');
          } else if (effectiveType === '3g') {
            setQuality('medium');
          } else if (effectiveType === '4g') {
            setQuality('high');
          }
        }
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }
  }, [autoQuality]);

  // Update audio URL when song or quality changes
  useEffect(() => {
    if (!song) {
      setAudioUrl(null);
      return;
    }

    // Use streaming URLs if available, otherwise fallback to original
    if (song.streamingUrls) {
      setAudioUrl(song.streamingUrls[quality] || song.audioUrl);
    } else {
      setAudioUrl(song.audioUrl);
    }
  }, [song, quality]);

  const changeQuality = useCallback((newQuality) => {
    setQuality(newQuality);
    setAutoQuality(false); // Disable auto when manually changed
  }, []);

  const toggleAutoQuality = useCallback(() => {
    setAutoQuality(prev => !prev);
  }, []);

  const getQualityLabel = () => {
    switch (quality) {
      case 'low':
        return '64 kbps';
      case 'medium':
        return '128 kbps';
      case 'high':
        return '320 kbps';
      default:
        return 'Auto';
    }
  };

  const getNetworkLabel = () => {
    switch (networkSpeed) {
      case 'slow-2g':
        return 'Slow';
      case '2g':
        return '2G';
      case '3g':
        return '3G';
      case '4g':
        return '4G+';
      default:
        return 'Unknown';
    }
  };

  return {
    audioUrl,
    quality,
    autoQuality,
    networkSpeed,
    changeQuality,
    toggleAutoQuality,
    getQualityLabel,
    getNetworkLabel,
    hasStreamingUrls: !!song?.streamingUrls,
  };
};