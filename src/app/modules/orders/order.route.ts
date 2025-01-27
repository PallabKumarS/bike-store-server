import express from 'express';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  orderStatusValidationSchema,
  orderValidationSchema,
} from './order.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/orders',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  validateRequest(orderValidationSchema),
  OrderController.createOrder,
);

router.get('/orders/revenue', OrderController.orderRevenue);

router.get(
  '/orders/my-orders',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  OrderController.getMyOrders,
);

router.get('/orders', auth(USER_ROLE.admin), OrderController.getAllOrders);

router.patch(
  '/orders/:orderId',
  auth(USER_ROLE.admin),
  validateRequest(orderStatusValidationSchema),
  OrderController.changeOrderStatus,
);

export const OrderRoutes = router;
