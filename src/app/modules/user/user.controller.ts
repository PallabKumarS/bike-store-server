import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// create teacher controller
const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created successfully',
    data: result,
  });
});

// get personal details
const getMe = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await UserServices.getMeFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

// change status
const changeStatus = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const result = await UserServices.changeStatusIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully',
    data: result,
  });
});

// get all users controller
const getAllUsers = catchAsync(async (req, res) => {
  const { data, meta } = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users are retrieved successfully',
    data,
    meta,
  });
});

// delete user controller (soft delete)
const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserServices.deleteUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is deleted successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getMe,
  changeStatus,
  getAllUsers,
  deleteUser,
};
