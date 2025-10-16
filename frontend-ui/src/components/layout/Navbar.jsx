import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Music, Search } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { USER_ROLES } from "../../utils/constants";

const Navbar = () => {
  const { user: clerkUser } = useUser();
  const { user } = useAuthStore();

  return (
    <nav className="bg-dark-secondary border-b border-dark-tertiary px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Music className="text-primary" size={32} />
          <span className="text-2xl font-bold">MusicStream</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search songs, albums, artists..."
              className="w-full pl-10 pr-4 py-2 bg-dark-tertiary rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user && (
            <>
              {user.role === USER_ROLES.ARTIST && (
                <Link
                  to="/artist"
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-green-500 transition"
                >
                  Artist Dashboard
                </Link>
              )}
              {user.role === USER_ROLES.ADMIN && (
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
          
          {clerkUser ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link
              to="/sign-in"
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-green-500 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;