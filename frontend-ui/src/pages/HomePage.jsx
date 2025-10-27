import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { songService } from "../services/songService";
import { albumService } from "../services/albumService";
import SongList from "../components/songs/SongList";
import AlbumList from "../components/albums/AlbumList";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [songs, albums] = await Promise.all([
        songService.getAllSongs(),
        albumService.getAllAlbums(),
      ]);
      
      setRecentSongs(songs.slice(0, 10));
      setRecentAlbums(albums.slice(0, 10));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-transparent rounded-lg p-12">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to MusicStream
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Discover millions of songs and podcasts
        </p>
        <Link
          to="/songs"
          className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-green-500 transition font-semibold"
        >
          <span>Browse Songs</span>
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Recent Songs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recent Songs</h2>
          <Link
            to="/songs"
            className="text-gray-400 hover:text-white transition flex items-center space-x-1"
          >
            <span>See all</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <SongList songs={recentSongs} />
      </section>

      {/* Recent Albums */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recent Albums</h2>
          <Link
            to="/albums"
            className="text-gray-400 hover:text-white transition flex items-center space-x-1"
          >
            <span>See all</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <AlbumList albums={recentAlbums} />
      </section>
    </div>
  );
};

export default HomePage;