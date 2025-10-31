import { useEffect, useState } from "react";
import { albumService } from "../services/albumService";
import AlbumList from "../components/albums/AlbumList";
import CreateAlbumModal from "../components/albums/CreateAlbumModal";
import Button from "../components/common/Button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

const MyLibraryPage = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchMyAlbums();
  }, []);

  const fetchMyAlbums = async () => {
    try {
      const data = await albumService.getMyAlbums();
      setAlbums(data);
    } catch (error) {
      toast.error("Failed to fetch your library");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlbumCreated = (newAlbum) => {
    setAlbums([newAlbum, ...albums]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Library</h1>
          <p className="text-sm sm:text-base text-gray-400">
            {albums.length} playlist{albums.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          Create Playlist
        </Button>
      </div>

      <AlbumList
        albums={albums}
        emptyMessage="You haven't created any playlists yet. Create one to start adding your favorite songs!"
      />

      <CreateAlbumModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleAlbumCreated}
      />
    </div>
  );
};

export default MyLibraryPage;
