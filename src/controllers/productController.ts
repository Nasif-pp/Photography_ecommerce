import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    const product = await productService.createProduct({
      title,
      description,
      price,
      imageUrl,
      createdBy: req.user._id
    });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  res.json(products);
};
