/* eslint-disable @typescript-eslint/no-explicit-any */
import { BikeService } from './bike.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// create bike
const createBike = catchAsync(async (req, res) => {
  const bike = req.body;

  const result = await BikeService.createBikeIntoDB(bike);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike is created successfully',
    data: result,
  });
});

// get all bikes
const getAllBike = catchAsync(async (req, res) => {
  const { data, meta } = await BikeService.getAllBikesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikes are retrieved successfully',
    data,
    meta,
  });
});

// get single bike
const getSingleBike = catchAsync(async (req, res) => {
  const id = req.params.productId;

  const result = await BikeService.getSingleBikeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike is retrieved successfully',
    data: result,
  });
});

// update bike
const updateBike = catchAsync(async (req, res) => {
  const id = req.params.productId;
  const bike = req.body;

  const result = await BikeService.updateBikeIntoDB(id, bike);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike is updated successfully',
    data: result,
  });
});

// delete bike
const deleteBike = catchAsync(async (req, res) => {
  const id = req.params.productId;

  const result = await BikeService.deleteBikeFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike is deleted successfully',
    data: result,
  });
});

export const BikeController = {
  createBike,
  getAllBike,
  getSingleBike,
  updateBike,
  deleteBike,
};
