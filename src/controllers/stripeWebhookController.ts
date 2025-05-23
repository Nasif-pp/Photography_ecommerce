import { Request, Response } from 'express';
import stripe from '../utils/stripe';
import Order from '../models/Order';
import Product from '../models/Product';
import bodyParser from 'body-parser';
import User from '../models/User';
import { sendEmail } from '../utils/email';

export const rawBodyMiddleware = bodyParser.raw({ type: 'application/json' });

interface ProductType {
  _id: string;
  title: string;
  // add other fields as needed
}

export const stripeWebhookHandler = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      const userId = session.metadata.userId;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      // Fetch products with typing and lean()
const orderItems: { product: ProductType | null; quantity: number }[] = await Promise.all(
  lineItems.data.map(async (item) => {
    const product = await Product.findOne({ title: item.description }).lean<ProductType | null>();
    return {
      product,
      quantity: item.quantity ?? 1,  // default to 1 if null or undefined
    };
  })
);

      const total = session.amount_total ? session.amount_total / 100 : 0;

      await Order.create({
        user: userId,
        products: orderItems.map(({ product, quantity }) => ({
          product: product?._id,
          quantity,
        })),
        total,
        status: 'Paid',
      });

      // Fetch user for notification
      const user = await User.findById(userId);

      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: 'Your Order is Confirmed 🎉',
          html: `
            <h1>Thank you for your order!</h1>
            <p>We have received your payment of <strong>$${total.toFixed(2)}</strong>.</p>
            <p>Your prints will be processed shortly.</p>
            <p>If you have any questions, reply to this email.</p>
          `,
        });
      }

      // Notify admin(s)
      const adminEmails = (process.env.ADMIN_EMAIL || '')
        .split(',')
        .map(email => email.trim())
        .filter(Boolean);

      if (adminEmails.length > 0) {
        const orderSummary = orderItems
          .map(item => `• ${item.quantity} x ${item.product?.title ?? 'Unknown Product'}`)
          .join('<br>');

        for (const email of adminEmails) {
          await sendEmail({
            to: email,
            subject: '🛒 New Order Received',
            html: `
              <h2>New Order Placed</h2>
              <p><strong>User:</strong> ${user?.email || 'Unknown'}</p>
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
              <p><strong>Items:</strong><br>${orderSummary}</p>
            `,
          });
        }
      }
    }

    res.status(200).send({ received: true });
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
};
