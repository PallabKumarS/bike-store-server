import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { BikeModel } from '../bikes/bike.model';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';
import mongoose from 'mongoose';

const createOrderIntoDB = async (order: TOrder) => {
  const bikeExists = await BikeModel.isBikeExists(
    order.product as unknown as string,
  );
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
    const newBike = await BikeModel.findOneAndUpdate(
      { _id: order.product },
      {
        quantity: remainingQuantity > 0 ? remainingQuantity : 0,
        inStock: remainingQuantity > 0 ? true : false,
      },
      { new: true, session },
    );

    if (!newBike) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update bike stock');
    }

    // second session to create order
    const newOrder = await OrderModel.create([order], { session });

    if (!newOrder?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
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

export const OrderService = {
  createOrderIntoDB,
  calculateTotalRevenue,
};
