import express from 'express';
import { createProduct, getProducts } from '../controllers/productController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/', protect, createProduct);
router.get('/', getProducts);

export default router;
