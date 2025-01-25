import express, { NextFunction, Request, Response } from 'express';
import { BikeController } from './bike.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createBikeValidationSchema,
  updateBikeValidationSchema,
} from './bike.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/products', BikeController.getAllBike);

router.post(
  '/products',
  auth(USER_ROLE.admin),
  validateRequest(createBikeValidationSchema),
  BikeController.createBike,
);

router.get('/products/:productId', BikeController.getSingleBike);

router.patch(
  '/products/:productId',
  auth(USER_ROLE.admin),
  validateRequest(updateBikeValidationSchema),
  BikeController.updateBike,
);

router.delete(
  '/products/:productId',
  auth(USER_ROLE.admin),
  BikeController.deleteBike,
);

export const BikeRoutes = router;
