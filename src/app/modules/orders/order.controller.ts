/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';

// create order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrderIntoDB(req.body);
  res.status(200).json({
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

// revenue controller
const orderRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.calculateTotalRevenue();
  res.status(200).json({
    success: true,
    message: 'Order revenue calculated successfully',
    data: result,
  });
});

// get my orders controller
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllMyOrdersFromDB(req.user?.userId);
  res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

// get all orders controller
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrdersFromDB();
  res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

// change order status controller
const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const result = await OrderService.changeOrderStatus(orderId, status);
  res.status(200).json({
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
};
