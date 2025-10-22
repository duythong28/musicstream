import SongCard from "./SongCard";

const SongList = ({ songs, title, emptyMessage = "No songs found" }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default SongList;