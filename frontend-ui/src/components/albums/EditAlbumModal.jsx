import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { albumService } from "../../services/albumService";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const EditAlbumModal = ({ isOpen, onClose, album, onSuccess }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    isPublic: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title,
        isPublic: album.isPublic,
      });
    }
  }, [album]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedAlbum = await albumService.updateAlbum(album._id, formData);
      toast.success("Album updated successfully!");
      onSuccess(updatedAlbum);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update album");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Album">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Album Title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter album title"
          required
        />

        {user?.role === "artist" && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-primary bg-dark-tertiary rounded focus:ring-primary"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-300">
              Make this album public
            </label>
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Updating..." : "Update Album"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAlbumModal;