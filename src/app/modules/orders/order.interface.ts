import { Types } from 'mongoose';

export type TOrder = {
  orderId: string;
  userId: string;
  productId: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  address: string;
  status?: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'processing';
  paymentId?: string;
};
