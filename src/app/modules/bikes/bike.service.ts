import { BikeModel } from './bike.model';
import { TBike } from './bike.interface';

const createBikeIntoDB = async (bike: TBike) => {
  const result = await BikeModel.create(bike);
  return result;
};

const getAllBikesFromDB = async () => {
  const result = await BikeModel.find();
  return result;
};

const getBikeBySearchTerm = async (searchTerm: string) => {
  const result = await BikeModel.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
    ],
  });
  return result;
};

const getSingleBikeFromDB = async (id: string) => {
  const result = await BikeModel.findOne({ _id: id });
  return result;
};

const updateBikeIntoDB = async (id: string, bike: Partial<TBike>) => {
  const result = await BikeModel.findOneAndUpdate({ _id: id }, bike, {
    new: true,
  });
  return result;
};

const deleteBikeFromDB = async (id: string) => {
  const result = await BikeModel.findByIdAndDelete(id);
  return result;
};

export const BikeService = {
  createBikeIntoDB,
  getAllBikesFromDB,
  getSingleBikeFromDB,
  updateBikeIntoDB,
  deleteBikeFromDB,
  getBikeBySearchTerm,
};
