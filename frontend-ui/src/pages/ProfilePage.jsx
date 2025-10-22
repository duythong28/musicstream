import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import EditProfileModal from "../components/user/EditProfileModal";
import Button from "../components/common/Button";
import { Edit, Music, Disc } from "lucide-react";
import { formatDate } from "../utils/formatTime";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary/20 to-transparent rounded-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={user.imageUrl}
            alt={user.fullName}
            className="w-32 h-32 rounded-full border-4 border-primary"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{user.fullName}</h1>
            <p className="text-gray-400 mb-4">{user.email}</p>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium capitalize">
                {user.role}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.isBlocked 
                  ? "bg-red-900 text-red-200" 
                  : "bg-green-900 text-green-200"
              }`}>
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
          <Button onClick={() => setShowEditModal(true)}>
            <Edit size={18} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-secondary rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-white">{user.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-white capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-white">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            {user.role === "artist" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Music className="text-primary" size={20} />
                    <span>Songs Uploaded</span>
                  </div>
                  <span className="text-2xl font-bold">--</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Disc className="text-primary" size={20} />
                    <span>Albums Created</span>
                  </div>
                  <span className="text-2xl font-bold">--</span>
                </div>
              </>
            )}
            {user.role === "user" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Disc className="text-primary" size={20} />
                  <span>Playlists Created</span>
                </div>
                <span className="text-2xl font-bold">--</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role-specific sections */}
      {user.role === "artist" && (
        <div className="bg-dark-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Artist Tools</h3>
          <p className="text-gray-400 mb-4">
            Access your artist dashboard to manage your songs and albums
          </p>
          <Button onClick={() => window.location.href = "/artist"}>
            Go to Artist Dashboard
          </Button>
        </div>
      )}

      {user.role === "admin" && (
        <div className="bg-dark-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Admin Tools</h3>
          <p className="text-gray-400 mb-4">
            Access the admin dashboard to manage users, songs, and albums
          </p>
          <Button onClick={() => window.location.href = "/admin"} variant="danger">
            Go to Admin Dashboard
          </Button>
        </div>
      )}

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default ProfilePage;