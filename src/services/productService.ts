import Product, { IProduct } from '../models/Product';

export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  return await Product.create(data);
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  return await Product.find().sort({ createdAt: -1 });
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};
