import { User } from "../models/user.model.js";

export const getAllUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users;
};

export const toggleBlockUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.isBlocked = !user.isBlocked;
  await user.save();
  return user;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};