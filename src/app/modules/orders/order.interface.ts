import { Types } from 'mongoose';

export type TOrder = {
  orderId: string;
  userId: string;
  product: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  address: string;
  status?:
    | 'pending'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'processing'
    | 'completed'
    | 'refunded';
};
