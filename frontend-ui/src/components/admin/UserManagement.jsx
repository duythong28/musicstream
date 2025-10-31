import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import Button from "../common/Button";
import { Shield, Ban, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await adminService.toggleBlockUser(userId);
      toast.success("User status updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminService.deleteUser(userId);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminService.changeUserRole(userId, newRole);
      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="bg-dark-secondary rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{user.fullName}</h3>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Role</label>
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user._id, e.target.value)}
                  className="w-full bg-dark-tertiary text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Status
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    user.isBlocked
                      ? "bg-red-900 text-red-200"
                      : "bg-green-900 text-green-200"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleBlockUser(user._id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-yellow-500 bg-dark-tertiary hover:bg-dark-hover rounded-lg transition text-sm touch-manipulation"
                  title={user.isBlocked ? "Unblock" : "Block"}
                >
                  <Ban size={16} />
                  <span>{user.isBlocked ? "Unblock" : "Block"}</span>
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-red-500 bg-dark-tertiary hover:bg-dark-hover rounded-lg transition text-sm touch-manipulation"
                  title="Delete"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-dark-secondary rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-tertiary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-tertiary">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-dark-tertiary">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                    className="bg-dark-tertiary text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="user">User</option>
                    <option value="artist">Artist</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isBlocked
                        ? "bg-red-900 text-red-200"
                        : "bg-green-900 text-green-200"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBlockUser(user._id)}
                      className="p-2 text-yellow-500 hover:bg-dark-hover rounded-lg transition"
                      title={user.isBlocked ? "Unblock" : "Block"}
                    >
                      <Ban size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 text-red-500 hover:bg-dark-hover rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
