import { Link, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Music, Search, Menu } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { USER_ROLES } from "../../utils/constants";
import { useState } from "react";

const Navbar = ({ onMenuClick }) => {
  const { user: clerkUser } = useUser();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  return (
    <nav className="bg-dark-secondary border-b border-dark-tertiary px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Music className="text-primary" size={28} />
          <span className="text-xl sm:text-2xl font-bold hidden sm:block">
            MusicStream
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="w-full relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, albums, artists..."
              className="w-full pl-10 pr-4 py-2 bg-dark-tertiary rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition"
        >
          <Search size={20} />
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user && (
            <>
              <Link
                to="/profile"
                className="hidden sm:block text-gray-400 hover:text-white transition text-sm"
              >
                Profile
              </Link>

              {user.role === USER_ROLES.ARTIST && (
                <Link
                  to="/artist"
                  className="hidden sm:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded-full hover:bg-green-500 transition text-sm"
                >
                  Dashboard
                </Link>
              )}
              {user.role === USER_ROLES.ADMIN && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-sm"
                >
                  Admin
                </Link>
              )}
            </>
          )}

          {clerkUser ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <Link
              to="/sign-in"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded-full hover:bg-green-500 transition text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar (Collapsible) */}
      {showSearch && (
        <form onSubmit={handleSearch} className="md:hidden mt-3 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-dark-tertiary rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            autoFocus
          />
        </form>
      )}
    </nav>
  );
};

export default Navbar;
