import Portfolio from '../models/Portfolio';
import cloudinary from '../utils/cloudinary';
import { IPortfolio } from '../models/Portfolio';

export const createPortfolioItem = async (
  file: Express.Multer.File,
  title: string,
  description: string,
  userId: string
): Promise<IPortfolio> => {
  const result = await cloudinary.uploader.upload(file.path, { folder: 'portfolio' });

  const portfolio = await Portfolio.create({
    title,
    description,
    imageUrl: result.secure_url,
    publicId: result.public_id,
    createdBy: userId
  });

  return portfolio;
};

export const getAllPortfolioItems = async (): Promise<IPortfolio[]> => {
  return await Portfolio.find().sort({ createdAt: -1 });
};

export const getPortfolioItem = async (id: string): Promise<IPortfolio | null> => {
  return await Portfolio.findById(id);
};

export const updatePortfolioItem = async (
  id: string,
  updates: Partial<IPortfolio>,
  file?: Express.Multer.File
): Promise<IPortfolio | null> => {
  const item = await Portfolio.findById(id);
  if (!item) throw new Error('Portfolio item not found');

  if (file) {
    await cloudinary.uploader.destroy(item.publicId);
    const result = await cloudinary.uploader.upload(file.path, { folder: 'portfolio' });
    updates.imageUrl = result.secure_url;
    updates.publicId = result.public_id;
  }

  Object.assign(item, updates);
  return await item.save();
};

export const deletePortfolioItem = async (id: string): Promise<void> => {
  const item = await Portfolio.findById(id);
  if (!item) throw new Error('Item not found');
  await cloudinary.uploader.destroy(item.publicId);
  await Portfolio.findByIdAndDelete(id);
};
