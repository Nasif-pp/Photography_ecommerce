import { Request, Response } from 'express';
import * as portfolioService from '../services/portfolioService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image required' });

    const item = await portfolioService.createPortfolioItem(
      req.file,
      title,
      description,
      req.user._id
    );
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const items = await portfolioService.getAllPortfolioItems();
  res.json(items);
};

export const getOne = async (req: Request, res: Response) => {
  const item = await portfolioService.getPortfolioItem(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const item = await portfolioService.updatePortfolioItem(req.params.id, updates, req.file);
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    await portfolioService.deletePortfolioItem(req.params.id);
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
