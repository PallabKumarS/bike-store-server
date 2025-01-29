/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { BikeModel } from '../bikes/bike.model';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';
import { generateOrderId } from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserModel } from '../user/user.model';
import { orderUtils } from './order.utils';
import config from '../../config';
import mongoose from 'mongoose';

// create order into db
const createOrderIntoDB = async (order: TOrder, client_ip: string) => {
  const bikeExists = await BikeModel.isBikeExists(order.productId);
  if (!bikeExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }
  const remainingQuantity = bikeExists.quantity - order.quantity;

  if (remainingQuantity < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Insufficient stock. The order cannot be placed.',
    );
  }

  try {
    // generate order id
    order.orderId = await generateOrderId();

    const newOrder = await OrderModel.create(order);

    if (!newOrder) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }

    const user = await UserModel.findOne({ userId: order.userId });

    const shurjopayPayload = {
      amount: order.totalPrice,
      order_id: order.orderId,
      currency: 'BDT',
      customer_name: user?.name,
      customer_address: order.address,
      customer_email: user?.email,
      customer_phone: user?.phone || 'N/A',
      customer_city: 'N/A',
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    let updatedOrder: TOrder | null = null;

    if (payment?.transactionStatus) {
      updatedOrder = await OrderModel.findOneAndUpdate(
        { orderId: order.orderId },
        {
          $set: {
            transaction: {
              paymentId: payment.sp_order_id,
              transactionStatus: payment.transactionStatus,
              paymentUrl: payment.checkout_url,
            },
          },
        },
        { new: true },
      );
    }

    if (!updatedOrder) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update order');
    }

    return updatedOrder;
  } catch (err: any) {
    throw new Error(err);
  }
};

// verify payment
const verifyPayment = async (paymentId: string) => {
  const payment = await orderUtils.verifyPaymentAsync(paymentId);

  if (payment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.paymentId': paymentId,
      },
      {
        'transaction.bank_status': payment[0].bank_status,
        'transaction.sp_code': payment[0].sp_code,
        'transaction.sp_message': payment[0].sp_message,
        'transaction.method': payment[0].method,
        'transaction.date_time': payment[0].date_time,
        'transaction.transactionStatus': payment[0].transaction_status,
        status:
          payment[0].bank_status == 'Success'
            ? 'paid'
            : payment[0].bank_status == 'Failed'
              ? 'pending'
              : payment[0].bank_status == 'Cancel'
                ? 'cancelled'
                : 'pending',
      },
    );
  }

  // if the payment is successful, update the bike quantity
  if (payment[0].bank_status === 'Success') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // check if order was placed before
      const orderExists = await OrderModel.findOne({
        'transaction.paymentId': paymentId,
      });

      if (!orderExists) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'Order was not placed correctly',
        );
      }

      const bikeExists = await BikeModel.isBikeExists(orderExists.productId);

      if (!bikeExists) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'Product was not found in order',
        );
      }

      const remainingQuantity = bikeExists.quantity - orderExists.quantity;

      // update bike quantity (first transaction)
      const updatedBike = await BikeModel.findOneAndUpdate(
        { _id: orderExists.productId },
        {
          quantity: remainingQuantity,
          inStock: remainingQuantity > 0 ? true : false,
        },
        { new: true, session },
      );

      if (!updatedBike) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update bike stock',
        );
      }

      const updatedOrder = await OrderModel.findOneAndUpdate(
        { 'transaction.paymentId': paymentId },
        {
          'transaction.paymentUrl': `${config.sp_return_url}?order_id=${paymentId}`,
        },
        { new: true, session },
      );


      if (!updatedOrder) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update order');
      }

      await session.commitTransaction();
      await session.endSession();
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
  }

  return payment;
};

// calculate total revenue
const calculateTotalRevenue = async () => {
  const result = await OrderModel.aggregate([
    // stage 1
    {
      $lookup: {
        from: 'bikes',
        localField: 'productId',
        foreignField: '_id',
        as: 'bikeDetails',
      },
    },

    // stage 2
    {
      $unwind: {
        path: '$bikeDetails',
      },
    },

    // stage 3
    {
      $addFields: {
        totalPrice: { $multiply: ['$bikeDetails.price', '$quantity'] },
      },
    },

    // stage 4
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },

    // Stage 5
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  if (result.length > 0) {
    return result[0].totalRevenue;
  } else {
    return 0;
  }
};

// get single order
const getSingleOrderFromDB = async (orderId: string) => {
  const result = await OrderModel.findOne({ orderId }).populate('productId');
  return result;
};

// get all user orders
const getAllMyOrdersFromDB = async (userId: string) => {
  const result = await OrderModel.find({ userId }).populate('productId');
  return result;
};

// get all orders
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(OrderModel.find(), query)
    .filter()
    .sort()
    .paginate();
  const data = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return {
    meta,
    data,
  };
};

// order status change
const changeOrderStatus = async (orderId: string, status: string) => {
  const orderExists = await OrderModel.findOne({ orderId });

  if (!orderExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (
    orderExists.status === 'paid' ||
    orderExists.status === 'delivered' ||
    orderExists.status == 'shipped' ||
    orderExists.status == 'processing'
  ) {
    if (status === 'pending' || status === 'cancelled') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Order already ${orderExists.status}`,
      );
    }
  }

  if (orderExists.status === 'processing') {
    if (status !== 'shipped' && status !== 'delivered') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Order already ${orderExists.status}`,
      );
    }
  }

  if (orderExists.status === 'shipped') {
    if (status !== 'delivered') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Order already ${orderExists.status}`,
      );
    }
  }

  if (orderExists.status === 'delivered') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Order already ${orderExists.status}`,
    );
  }

  const result = await OrderModel.findOneAndUpdate(
    { orderId: orderId },
    { status },
    { new: true },
  );
  return result;
};

export const OrderService = {
  createOrderIntoDB,
  calculateTotalRevenue,
  getAllMyOrdersFromDB,
  getAllOrdersFromDB,
  changeOrderStatus,
  getSingleOrderFromDB,
  verifyPayment,
};
