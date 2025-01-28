/* eslint-disable @typescript-eslint/no-explicit-any */
import { BikeModel } from './bike.model';
import { TBike } from './bike.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { bikeSearchableFields } from './bike.constant';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { Types } from 'mongoose';

// create new bike here
const createBikeIntoDB = async (bike: TBike) => {
  const newBike = await BikeModel.create(bike);
  return newBike;
};

// get all bikes
const getAllBikesFromDB = async (query: Record<string, unknown>) => {
  const bikeQuery = new QueryBuilder(BikeModel.find(), query)
    .search(bikeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await bikeQuery.modelQuery;
  const meta = await bikeQuery.countTotal();

  return { data, meta };
};

const getSingleBikeFromDB = async (id: string) => {
  // checking if bike exists
  const existingBike = BikeModel.isBikeExists(new Types.ObjectId(id));
  if (!existingBike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike does not exist');
  }

  const result = await BikeModel.findOne({ _id: id });
  return result;
};

// update bike into db
const updateBikeIntoDB = async (id: string, bike: Partial<TBike>) => {
  // checking if bike exists
  const existingBike = BikeModel.isBikeExists(new Types.ObjectId(id));
  if (!existingBike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike does not exist');
  }

  const result = await BikeModel.findOneAndUpdate({ _id: id }, bike, {
    new: true,
  });
  return result;
};

// delete bike from db
const deleteBikeFromDB = async (id: string) => {
  // checking if bike exists
  const existingBike = BikeModel.isBikeExists(new Types.ObjectId(id));
  if (!existingBike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike does not exist');
  }
  const result = await BikeModel.findByIdAndDelete(id);
  return result;
};

// get brands from db
const getBrandsFromDB = async () => {
  const result = await BikeModel.distinct('brand');

  return result;
};

export const BikeService = {
  createBikeIntoDB,
  getAllBikesFromDB,
  getSingleBikeFromDB,
  updateBikeIntoDB,
  deleteBikeFromDB,
  getBrandsFromDB,
};
