import { useState } from "react";
import UserManagement from "../components/admin/UserManagement";
import SongManagement from "../components/admin/SongManagement";
import AlbumManagement from "../components/admin/AlbumManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-400">
          Manage users, songs, and albums
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 sm:mb-8 border-b border-dark-tertiary overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 sm:pb-4 px-2 font-medium transition whitespace-nowrap text-sm sm:text-base ${
            activeTab === "users"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("songs")}
          className={`pb-3 sm:pb-4 px-2 font-medium transition whitespace-nowrap text-sm sm:text-base ${
            activeTab === "songs"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Songs
        </button>
        <button
          onClick={() => setActiveTab("albums")}
          className={`pb-3 sm:pb-4 px-2 font-medium transition whitespace-nowrap text-sm sm:text-base ${
            activeTab === "albums"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Albums
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && <UserManagement />}
      {activeTab === "songs" && <SongManagement />}
      {activeTab === "albums" && <AlbumManagement />}
    </div>
  );
};

export default AdminDashboard;
