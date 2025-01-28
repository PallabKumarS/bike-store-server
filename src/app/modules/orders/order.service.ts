import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { BikeModel } from '../bikes/bike.model';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';
import mongoose from 'mongoose';
import { generateOrderId } from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';

// create order into db
const createOrderIntoDB = async (order: TOrder) => {
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create a user (first transaction)
    const updatedBike = await BikeModel.findOneAndUpdate(
      { _id: order.productId },
      {
        quantity: remainingQuantity,
        inStock: remainingQuantity > 0 ? true : false,
      },
      { new: true, session },
    );

    if (!updatedBike) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update bike stock');
    }

    // second session to create order
    // generate order id
    order.orderId = await generateOrderId();

    const newOrder = await OrderModel.create([order], { session });

    if (!newOrder?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }

    await session.commitTransaction();
    await session.endSession();

    return newOrder[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// calculate total revenue
const calculateTotalRevenue = async () => {
  const result = await OrderModel.aggregate([
    // stage 1
    {
      $lookup: {
        from: 'bikes',
        localField: 'product',
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
    if (status === 'pending' || status === 'canceled') {
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
};
