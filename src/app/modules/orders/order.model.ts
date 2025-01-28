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
    transaction: {
      paymentId: {
        type: String,
      },
      transactionStatus: {
        type: String,
      },
      bank_status: {
        type: String,
      },
      sp_code: {
        type: String,
      },
      sp_message: {
        type: String,
      },
      method: {
        type: String,
      },
      date_time: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.statics.isOrderExists = async function (
  id: string,
): Promise<TOrder | null> {
  return await OrderModel.findOne({ orderId: id });
};

export const OrderModel = model<TOrder, IOrder>('Order', orderSchema);
