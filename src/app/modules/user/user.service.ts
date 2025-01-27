/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateUserId } from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';

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
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(UserModel.find(), query)
    .filter()
    .sort()
    .paginate();

  const data = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    data,
  };
};

const deleteUserFromDB = async (userId: string) => {
  const result = await UserModel.findOneAndUpdate(
    { userId },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getMeFromDB,
  changeStatusIntoDB,
  getAllUsersFromDB,
  deleteUserFromDB,
};
