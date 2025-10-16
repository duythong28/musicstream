import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { songService } from "../services/songService";
import { albumService } from "../services/albumService";
import SongList from "../components/songs/SongList";
import AlbumList from "../components/albums/AlbumList";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      const [allSongs, allAlbums] = await Promise.all([
        songService.getAllSongs(),
        albumService.getAllAlbums(),
      ]);

      const lowerQuery = searchQuery.toLowerCase();

      // Filter songs
      const filteredSongs = allSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(lowerQuery) ||
          song.artistName.toLowerCase().includes(lowerQuery)
      );

      // Filter albums
      const filteredAlbums = allAlbums.filter(
        (album) =>
          album.title.toLowerCase().includes(lowerQuery) ||
          album.creatorName.toLowerCase().includes(lowerQuery)
      );

      setSongs(filteredSongs);
      setAlbums(filteredAlbums);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Searching...</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Enter a search query to find songs and albums</p>
      </div>
    );
  }

  const hasResults = songs.length > 0 || albums.length > 0;

  return (
    <div className="space-y-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-400">Showing results for "{query}"</p>
      </div>

      {hasResults ? (
        <>
          {songs.length > 0 && (
            <section>
              <SongList songs={songs} title={`Songs (${songs.length})`} />
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <AlbumList albums={albums} title={`Albums (${albums.length})`} />
            </section>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">Try different keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;