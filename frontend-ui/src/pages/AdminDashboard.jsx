import { useState } from "react";
import UserManagement from "../components/admin/UserManagement";
import SongManagement from "../components/admin/SongManagement";
import AlbumManagement from "../components/admin/AlbumManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users"); // users, songs, albums

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage users, songs, and albums</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-dark-tertiary">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-4 px-2 font-medium transition ${
            activeTab === "users"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("songs")}
          className={`pb-4 px-2 font-medium transition ${
            activeTab === "songs"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Songs
        </button>
        <button
          onClick={() => setActiveTab("albums")}
          className={`pb-4 px-2 font-medium transition ${
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