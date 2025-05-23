import { Request, Response } from 'express';
import * as userService from '../services/userService';
import bcrypt from 'bcryptjs';

// GET /api/users/profile
export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, email, password, profilePhoto } = req.body;
    const user = await userService.getUserById(req.user._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: 'Profile updated', user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
