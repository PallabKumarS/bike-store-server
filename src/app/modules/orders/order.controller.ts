/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { orderValidationSchema } from './order.validation';

const createOrder = async (req: Request, res: Response) => {
  try {
    const { order } = req.body;
    const { value } = orderValidationSchema.validate(order);

    // error handling
    // if (error) {
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Validation failed',
    //     error: error.details,
    //   });
    // }

    const result = await OrderService.createOrderIntoDB(value);
    res.status(200).json({
      success: true,
      message: 'Order is created successfully',
      data: result,
    });
  } catch (error: any) {
    // if (
    //   error instanceof Error &&
    //   error.message === 'Insufficient stock. The order cannot be placed.'
    // ) {
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message,
    //   });
    // }
    console.log(error);
  }
};
const orderRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.calculateTotalRevenue();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
};

export const OrderController = {
  createOrder,
  orderRevenue,
};
