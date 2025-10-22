import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { formatTime } from "../../utils/formatTime";

const SongManagement = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const data = await adminService.getAllSongsAdmin();
      setSongs(data);
    } catch (error) {
      toast.error("Failed to fetch songs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisible = async (songId) => {
    try {
      await adminService.toggleSongVisible(songId);
      toast.success("Song visibility updated");
      fetchSongs();
    } catch (error) {
      toast.error("Failed to update song");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading songs...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Song Management</h2>
      
      <div className="bg-dark-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-tertiary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Song</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Artist</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Public</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Visible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-tertiary">
            {songs.map((song) => (
              <tr key={song._id} className="hover:bg-dark-tertiary">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg"
                    />
                    <span className="font-medium">{song.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{song.artistName}</td>
                <td className="px-6 py-4 text-gray-400">{formatTime(song.duration)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      song.isPublic
                        ? "bg-green-900 text-green-200"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {song.isPublic ? "Public" : "Private"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      song.isVisible
                        ? "bg-blue-900 text-blue-200"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {song.isVisible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleVisible(song._id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition"
                    title={song.isVisible ? "Hide" : "Show"}
                  >
                    {song.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongManagement;