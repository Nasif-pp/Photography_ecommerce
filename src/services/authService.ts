import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

const register = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const user = await User.create({ name, email, password });
  return {
    user,
    token: generateToken(user),
  };
};

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  return {
    user,
    token: generateToken(user),
  };
};

export default { register, login };
