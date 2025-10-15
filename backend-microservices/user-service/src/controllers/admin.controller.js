// user-service/src/controllers/admin.controller.js
import {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  updateUserRole,
} from "../services/admin.service.js";

export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await toggleBlockUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const removeUser = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await updateUserRole(req.params.id, role);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
