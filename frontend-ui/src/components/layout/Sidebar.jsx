import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Music,
  Disc,
  Library,
  Sparkles,
  X,
  Settings,
} from "lucide-react";

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Sparkles, label: "For You", path: "/for-you" },
    { icon: Music, label: "Songs", path: "/songs" },
    { icon: Disc, label: "Albums", path: "/albums" },
    { icon: Library, label: "My Library", path: "/library" },
    { icon: Settings, label: "Profile", path: "/profile" },
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (onClose) onClose();
  };

  return (
    <div className="w-64 bg-dark-secondary h-full flex flex-col border-r border-dark-tertiary">
      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-dark-tertiary">
        <span className="font-semibold">Menu</span>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 py-4 sm:py-6 overflow-y-auto">
        <nav className="space-y-1 sm:space-y-2 px-2 sm:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-dark-tertiary text-primary"
                      : "text-gray-400 hover:text-white hover:bg-dark-tertiary"
                  }
                `}
              >
                <Icon size={22} />
                <span className="font-medium text-sm sm:text-base">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-dark-tertiary">
        <div className="text-xs text-gray-400 space-y-1">
          <p>© 2025 MusicStream</p>
          <p>Cloud-Native Microservices</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
