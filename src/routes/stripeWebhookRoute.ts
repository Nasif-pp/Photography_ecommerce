import express from 'express';
import { stripeWebhookHandler, rawBodyMiddleware } from '../controllers/stripeWebhookController';

const router = express.Router();

router.post('/webhook', rawBodyMiddleware, stripeWebhookHandler);

export default router;
