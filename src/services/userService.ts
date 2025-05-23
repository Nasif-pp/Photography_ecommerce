import User, { IUser } from '../models/User';

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).select('-password');
};

export const updateUser = async (id: string, updates: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
};
