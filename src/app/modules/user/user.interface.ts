/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  userId: string;
  password: string;
  email: string;
  passwordChangedAt?: Date;
  role: 'admin' | 'customer';
  status: 'active' | 'blocked';
  isDeleted: boolean;
  phone?: string;
};

export interface IUser extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>;

  isPasswordMatched(
    myPlaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
