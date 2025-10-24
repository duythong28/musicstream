import { User } from "../models/user.model.js";

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ clerkId: userData.clerkId });
  if (existingUser) {
    return existingUser;
  }

  const user = await User.create(userData);
  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getUserByClerkId = async (clerkId) => {
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
