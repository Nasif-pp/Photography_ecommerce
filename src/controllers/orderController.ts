import { Request, Response } from 'express';
import stripe from '../utils/stripe';
import * as orderService from '../services/orderService';
import Product from '../models/Product';

export const createCheckoutSession = async (req: any, res: Response) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'cad',
        product_data: {
          name: product.title,
          images: [product.imageUrl]
        },
        unit_amount: product.price * 100
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  });

  // Store order (can link via webhook later)
  await orderService.createOrder(req.user._id, product._id.toString(), product.price, session.payment_intent as string);

  res.json({ id: session.id });
};

// Optional: webhook handler to mark order paid
