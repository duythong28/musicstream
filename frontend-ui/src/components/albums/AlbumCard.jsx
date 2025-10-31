import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const AlbumCard = ({ album }) => {
  return (
    <Link
      to={`/albums/${album._id}`}
      className="group bg-dark-tertiary rounded-lg p-3 sm:p-4 hover:bg-dark-hover transition-colors cursor-pointer"
    >
      <div className="relative mb-3 sm:mb-4">
        <img
          src={album.imageUrl}
          alt={album.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <button className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg touch-manipulation">
          <Play className="text-black ml-0.5" size={20} />
        </button>
      </div>

      <h3 className="font-semibold truncate mb-1 text-sm sm:text-base">
        {album.title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-400 truncate">
        {album.creatorName}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {album.songIds?.length || 0} songs
      </p>
    </Link>
  );
};

export default AlbumCard;
