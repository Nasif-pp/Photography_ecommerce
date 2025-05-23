import Order from '../models/Order';

export const createOrder = async (userId: string, productId: string, amount: number, paymentIntentId: string) => {
  return await Order.create({
    userId,
    productId,
    amount,
    paymentIntentId,
    paymentStatus: 'pending'
  });
};

export const markOrderPaid = async (paymentIntentId: string) => {
  const order = await Order.findOne({ paymentIntentId });
  if (order) {
    order.paymentStatus = 'paid';
    await order.save();
  }
};
