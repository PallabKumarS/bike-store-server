import { Schema, model } from 'mongoose';
import { IOrder, TOrder } from './order.interface';

const orderSchema = new Schema<TOrder, IOrder>(
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
    productId: {
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
        'paid',
      ],
      default: 'pending',
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.statics.isBikeExists = async function (
  id: Schema.Types.ObjectId,
): Promise<TOrder | null> {
  return await OrderModel.findOne({ orderId: id });
};

export const OrderModel = model<TOrder, IOrder>('Order', orderSchema);
