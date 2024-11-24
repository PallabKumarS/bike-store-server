import { BikeModel } from '../bikes/bike.model';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';

const createOrderIntoDB = async (order: TOrder) => {
  const bike = await BikeModel.findOne({ _id: order.product });
  if (!bike) {
    throw new Error('Bike not found');
  }
  const remainingQuantity = bike.quantity - order.quantity;

  if (remainingQuantity < 0) {
    throw new Error('Insufficient stock. The order cannot be placed.');
  }

  const updatedBike = await BikeModel.findOneAndUpdate(
    { _id: order.product },
    {
      quantity: remainingQuantity > 0 ? remainingQuantity : 0,
      inStock: remainingQuantity > 0 ? true : false,
    },
    { new: true },
  );
  const result = await OrderModel.create(order);

  return { result, updatedBike };
};

const calculateTotalRevenue = async () => {
  const result = await OrderModel.aggregate([
    // stage 1
    {
      $addFields: {
        product: { $toObjectId: '$product' },
      },
    },

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
