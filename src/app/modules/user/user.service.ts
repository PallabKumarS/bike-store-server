/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateUserId } from '../../utils/generateID';

// create teacher into db
const createUserIntoDB = async (payload: Partial<TUser>) => {
  // set generated id
  payload.userId = await generateUserId();

  // create a user
  const newUser = await UserModel.create(payload);

  return newUser;
};

// get personal details from db
const getMeFromDB = async (userId: string) => {
  const result = await UserModel.findOne({ userId });
  return result;
};

// change status in user
const changeStatusIntoDB = async (
  userId: string,
  payload: { status: string },
) => {
  const result = await UserModel.findOneAndUpdate({ userId }, payload, {
    new: true,
  });
  return result;
};

// get all users
const getAllUsersFromDB = async () => {
  const result = await UserModel.find({});
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getMeFromDB,
  changeStatusIntoDB,
  getAllUsersFromDB,
};
