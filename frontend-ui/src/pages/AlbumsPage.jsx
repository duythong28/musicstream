import { useEffect, useState } from "react";
import { albumService } from "../services/albumService";
import AlbumList from "../components/albums/AlbumList";

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await albumService.getAllAlbums();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading albums...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Albums</h1>
        <p className="text-sm sm:text-base text-gray-400">
          {albums.length} album{albums.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <AlbumList albums={albums} emptyMessage="No albums available yet" />
    </div>
  );
};

export default AlbumsPage;
