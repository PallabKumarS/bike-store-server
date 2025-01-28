import { Model, Types } from 'mongoose';

export type TOrder = {
  orderId: string;
  userId: string;
  productId: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  address: string;
  status?:
    | 'pending'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'processing'
    | 'paid';
  paymentId?: string;
};

export interface IOrder extends Model<TOrder> {
  // eslint-disable-next-line no-unused-vars
  isBikeExists(id: string): Promise<TOrder | null>;
}
