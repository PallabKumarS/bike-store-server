import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
  {
    orderId: {
      type: String,
      unique: true,
    },

    userId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Bike',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'shipped',
        'delivered',
        'cancelled',
        'processing',
        'completed',
        'refunded',
      ],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<TOrder>('Order', orderSchema);
