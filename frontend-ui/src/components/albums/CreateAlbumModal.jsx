import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { Upload } from "lucide-react";
import { albumService } from "../../services/albumService";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const CreateAlbumModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    isPublic: user?.role === "artist",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("isPublic", formData.isPublic);
    data.append("image", imageFile);

    try {
      const newAlbum = await albumService.createAlbum(data);
      toast.success("Album created successfully!");
      onSuccess(newAlbum);
      onClose();
      setFormData({ title: "", isPublic: user?.role === "artist" });
      setImageFile(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create album");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Album">
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Album Cover
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 px-4 py-2 bg-dark-tertiary rounded-lg cursor-pointer hover:bg-dark-hover transition">
              <Upload size={20} />
              <span>{imageFile ? imageFile.name : "Choose Image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
                required
              />
            </label>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Creating..." : "Create Album"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAlbumModal;