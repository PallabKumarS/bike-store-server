/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// create order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

// revenue controller
const orderRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.calculateTotalRevenue();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order revenue retrieved successfully',
    data: result,
  });
});

// get single order controller
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderService.getSingleOrderFromDB(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

// get my orders controller
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllMyOrdersFromDB(req.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your orders retrieved successfully',
    data: result,
  });
});

// get all orders controller
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await OrderService.getAllOrdersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data,
    meta,
  });
});

// change order status controller
const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const result = await OrderService.changeOrderStatus(orderId, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  orderRevenue,
  getMyOrders,
  getAllOrders,
  changeOrderStatus,
  getSingleOrder,
};
