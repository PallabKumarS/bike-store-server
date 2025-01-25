import express, { NextFunction, Request, Response } from 'express';
import { BikeController } from './bike.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createBikeValidationSchema,
  updateBikeValidationSchema,
} from './bike.validation';

const router = express.Router();

router.get('/products', BikeController.getAllBike);
router.post(
  '/products',
  validateRequest(createBikeValidationSchema),
  BikeController.createBike,
);
router.get('/products/:productId', BikeController.getSingleBike);
router.patch(
  '/products/:productId',
  validateRequest(updateBikeValidationSchema),
  BikeController.updateBike,
);
router.delete('/products/:productId', BikeController.deleteBike);

export const BikeRoutes = router;
