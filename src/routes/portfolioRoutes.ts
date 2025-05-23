import express from 'express';
import multer from 'multer';
import { createItem, getAll, getOne, updateItem, deleteItem } from '../controllers/portfolioController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', protect, upload.single('image'), createItem);
router.put('/:id', protect, upload.single('image'), updateItem);
router.delete('/:id', protect, deleteItem);

export default router;
