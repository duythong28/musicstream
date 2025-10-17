import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { user: clerkUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update Clerk user
      await clerkUser.update({
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" "),
      });

      toast.success("Profile updated successfully!");
      onClose();
      window.location.reload(); // Reload to sync changes
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-4">
          <img
            src={user?.imageUrl}
            alt={user?.fullName}
            className="w-24 h-24 rounded-full"
          />
        </div>

        <Input
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Enter your full name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <p className="text-gray-400">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Role
          </label>
          <p className="text-gray-400 capitalize">{user?.role}</p>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;