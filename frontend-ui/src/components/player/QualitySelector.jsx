// frontend/src/components/player/QualitySelector.jsx
import { useState } from "react";
import { Settings, Check, Wifi } from "lucide-react";

const QualitySelector = ({
  quality,
  autoQuality,
  networkSpeed,
  onQualityChange,
  onToggleAuto,
  getQualityLabel,
  getNetworkLabel,
  hasStreamingUrls,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!hasStreamingUrls) {
    return null; // Don't show if no streaming URLs available
  }

  const qualities = [
    { value: "low", label: "Low (64 kbps)", description: "Save data" },
    { value: "medium", label: "Medium (128 kbps)", description: "Balanced" },
    { value: "high", label: "High (320 kbps)", description: "Best quality" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-tertiary hover:bg-dark-hover transition text-sm"
        title="Audio Quality"
      >
        <Settings size={16} />
        <span>{getQualityLabel()}</span>
        {autoQuality && <span className="text-xs text-primary">Auto</span>}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-dark-secondary rounded-lg shadow-2xl border border-dark-tertiary z-50">
            {/* Header */}
            <div className="p-4 border-b border-dark-tertiary">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Audio Quality</h3>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Wifi size={14} />
                  <span>{getNetworkLabel()}</span>
                </div>
              </div>

              {/* Auto Quality Toggle */}
              <button
                onClick={onToggleAuto}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-dark-tertiary hover:bg-dark-hover transition"
              >
                <span className="text-sm">Auto Quality</span>
                <div
                  className={`w-10 h-5 rounded-full transition ${
                    autoQuality ? "bg-primary" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transform transition ${
                      autoQuality
                        ? "translate-x-5 mt-0.5"
                        : "translate-x-0.5 mt-0.5"
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Quality Options */}
            <div className="p-2">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  onClick={() => {
                    onQualityChange(q.value);
                    setIsOpen(false);
                  }}
                  disabled={autoQuality}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                    autoQuality
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-dark-tertiary"
                  } ${quality === q.value ? "bg-dark-tertiary" : ""}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{q.label}</span>
                    <span className="text-xs text-gray-400">
                      {q.description}
                    </span>
                  </div>
                  {quality === q.value && !autoQuality && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer Info */}
            <div className="p-3 border-t border-dark-tertiary text-xs text-gray-400">
              {autoQuality ? (
                <p>Quality adjusts automatically based on your network speed</p>
              ) : (
                <p>Manual quality selected. Enable auto for best experience.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QualitySelector;
