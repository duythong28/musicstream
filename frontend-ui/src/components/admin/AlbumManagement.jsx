import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const AlbumManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await adminService.getAllAlbumsAdmin();
      setAlbums(data);
    } catch (error) {
      toast.error("Failed to fetch albums");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisible = async (albumId) => {
    try {
      await adminService.toggleAlbumVisible(albumId);
      toast.success("Album visibility updated");
      fetchAlbums();
    } catch (error) {
      toast.error("Failed to update album");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading albums...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Album Management</h2>
      
      <div className="bg-dark-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-tertiary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Album</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Creator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Songs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Public</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Visible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-tertiary">
            {albums.map((album) => (
              <tr key={album._id} className="hover:bg-dark-tertiary">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={album.imageUrl}
                      alt={album.title}
                      className="w-12 h-12 rounded-lg"
                    />
                    <span className="font-medium">{album.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{album.creatorName}</td>
                <td className="px-6 py-4 text-gray-400">{album.songIds?.length || 0}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      album.isPublic
                        ? "bg-green-900 text-green-200"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {album.isPublic ? "Public" : "Private"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      album.isVisible
                        ? "bg-blue-900 text-blue-200"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {album.isVisible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleVisible(album._id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition"
                    title={album.isVisible ? "Hide" : "Show"}
                  >
                    {album.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
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

export default AlbumManagement;