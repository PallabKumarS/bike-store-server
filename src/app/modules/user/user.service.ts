/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { generateUserId } from '../../utils/generateID';

// create teacher into db
const createUserIntoDB = async (payload: Partial<TUser>) => {
  // if password is not given, use default password
  payload.password = payload.password || (config.default_password as string);

  // set generated id
  payload.id = await generateUserId();

  // create a user
  const newUser = await UserModel.create(payload);

  return newUser;
};

// get personal details from db
const getMeFromDB = async (userId: string, role: string) => {
  const result = await UserModel.findOne({ id: userId });
  return result;
};

// change status in user
const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getMeFromDB,
  changeStatusIntoDB,
};
