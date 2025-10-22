import { BarChart3, Activity, Circle, Eye, EyeOff } from "lucide-react";

const VisualizerControls = ({ type, setType, isVisible, setIsVisible }) => {
  const visualizerTypes = [
    { value: "bars", label: "Bars", icon: BarChart3 },
    { value: "wave", label: "Wave", icon: Activity },
    { value: "circular", label: "Circular", icon: Circle },
  ];

  return (
    <div className="flex items-center space-x-2">
      {/* Toggle Visibility */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-dark-tertiary"
        title={isVisible ? "Hide Visualizer" : "Show Visualizer"}
      >
        {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>

      {/* Type Selector */}
      {isVisible && (
        <div className="flex items-center space-x-1 bg-dark-tertiary rounded-lg p-1">
          {visualizerTypes.map((vizType) => {
            const Icon = vizType.icon;
            return (
              <button
                key={vizType.value}
                onClick={() => setType(vizType.value)}
                className={`p-2 rounded transition ${
                  type === vizType.value
                    ? "bg-primary text-black"
                    : "text-gray-400 hover:text-white"
                }`}
                title={vizType.label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VisualizerControls;