import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { Upload } from "lucide-react";
import { songService } from "../../services/songService";
import toast from "react-hot-toast";

const UploadSongModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile || !audioFile) {
      toast.error("Please select both image and audio files");
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("duration", formData.duration);
    data.append("image", imageFile);
    data.append("audio", audioFile);

    try {
      const newSong = await songService.uploadSong(data);
      toast.success("Song uploaded successfully!");
      onSuccess(newSong);
      onClose();
      setFormData({ title: "", duration: "" });
      setImageFile(null);
      setAudioFile(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to upload song");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload New Song">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Song Title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter song title"
          required
        />

        <Input
          label="Duration (seconds)"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="Enter duration in seconds"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Song Image
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Audio File
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 px-4 py-2 bg-dark-tertiary rounded-lg cursor-pointer hover:bg-dark-hover transition">
              <Upload size={20} />
              <span>{audioFile ? audioFile.name : "Choose Audio"}</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="hidden"
                required
              />
            </label>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Uploading..." : "Upload Song"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadSongModal;