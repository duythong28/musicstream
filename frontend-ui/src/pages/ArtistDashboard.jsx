import { useEffect, useState } from "react";
import { songService } from "../services/songService";
import { albumService } from "../services/albumService";
import UploadSongModal from "../components/songs/UploadSongModal";
import CreateAlbumModal from "../components/albums/CreateAlbumModal";
import Button from "../components/common/Button";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { formatTime } from "../utils/formatTime";

const ArtistDashboard = () => {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [activeTab, setActiveTab] = useState("songs"); // songs or albums

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [songsData, albumsData] = await Promise.all([
        songService.getMySongs(),
        albumService.getMyAlbums(),
      ]);
      setSongs(songsData);
      setAlbums(albumsData);
    } catch (error) {
      toast.error("Failed to fetch your content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongUploaded = (newSong) => {
    setSongs([newSong, ...songs]);
  };

  const handleAlbumCreated = (newAlbum) => {
    setAlbums([newAlbum, ...albums]);
  };

  const handleDeleteSong = async (songId) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      await songService.deleteSong(songId);
      setSongs(songs.filter((s) => s._id !== songId));
      toast.success("Song deleted");
    } catch (error) {
      toast.error("Failed to delete song");
    }
  };

  const handleToggleSongVisibility = async (songId) => {
    try {
      await songService.toggleVisibility(songId);
      setSongs(
        songs.map((s) =>
          s._id === songId ? { ...s, isPublic: !s.isPublic } : s
        )
      );
      toast.success("Visibility updated");
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      await albumService.deleteAlbum(albumId);
      setAlbums(albums.filter((a) => a._id !== albumId));
      toast.success("Album deleted");
    } catch (error) {
      toast.error("Failed to delete album");
    }
  };

  const handleToggleAlbumVisibility = async (albumId) => {
    try {
      await albumService.toggleVisibility(albumId);
      setAlbums(
        albums.map((a) =>
          a._id === albumId ? { ...a, isPublic: !a.isPublic } : a
        )
      );
      toast.success("Visibility updated");
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Artist Dashboard</h1>
        <p className="text-gray-400">Manage your songs and albums</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-secondary rounded-lg p-6">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Songs</h3>
          <p className="text-4xl font-bold">{songs.length}</p>
        </div>
        <div className="bg-dark-secondary rounded-lg p-6">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Albums</h3>
          <p className="text-4xl font-bold">{albums.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-dark-tertiary">
        <button
          onClick={() => setActiveTab("songs")}
          className={`pb-4 px-2 font-medium transition ${
            activeTab === "songs"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Songs
        </button>
        <button
          onClick={() => setActiveTab("albums")}
          className={`pb-4 px-2 font-medium transition ${
            activeTab === "albums"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Albums
        </button>
      </div>

      {/* Songs Tab */}
      {activeTab === "songs" && (
        <div>
          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus size={20} className="mr-2" />
              Upload Song
            </Button>
          </div>

          <div className="bg-dark-secondary rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-tertiary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Song</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-tertiary">
                {songs.length > 0 ? (
                  songs.map((song) => (
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
                      <td className="px-6 py-4 text-gray-400">
                        {formatTime(song.duration)}
                      </td>
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
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleSongVisibility(song._id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition"
                            title={song.isPublic ? "Make Private" : "Make Public"}
                          >
                            {song.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => handleDeleteSong(song._id)}
                            className="p-2 text-red-500 hover:bg-dark-hover rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      No songs yet. Upload your first song!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Albums Tab */}
      {activeTab === "albums" && (
        <div>
          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowCreateAlbumModal(true)}>
              <Plus size={20} className="mr-2" />
              Create Album
            </Button>
          </div>

          <div className="bg-dark-secondary rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-tertiary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Album</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Songs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-tertiary">
                {albums.length > 0 ? (
                  albums.map((album) => (
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
                      <td className="px-6 py-4 text-gray-400">
                        {album.songIds?.length || 0}
                      </td>
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
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleAlbumVisibility(album._id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition"
                            title={album.isPublic ? "Make Private" : "Make Public"}
                          >
                            {album.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(album._id)}
                            className="p-2 text-red-500 hover:bg-dark-hover rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      No albums yet. Create your first album!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadSongModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleSongUploaded}
      />
      <CreateAlbumModal
        isOpen={showCreateAlbumModal}
        onClose={() => setShowCreateAlbumModal(false)}
        onSuccess={handleAlbumCreated}
      />
    </div>
  );
};

export default ArtistDashboard;