import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { songService } from "../../services/songService";
import toast from "react-hot-toast";

const EditSongModal = ({ isOpen, onClose, song, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        duration: song.duration,
      });
    }
  }, [song]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedSong = await songService.updateSong(song._id, formData);
      toast.success("Song updated successfully!");
      onSuccess(updatedSong);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update song");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Song">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Song Title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter song title"
          required
        />

        <div className="flex space-x-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Updating..." : "Update Song"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSongModal;
