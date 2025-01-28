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
  transaction?: {
    paymentId?: string;
    transactionStatus?: string;
    bank_status?: string;
    sp_code?: string;
    sp_message?: string;
    method?: string;
    date_time?: string;
  };
};

export interface IOrder extends Model<TOrder> {
  // eslint-disable-next-line no-unused-vars
  isOrderExists(id: string): Promise<TOrder | null>;
}
