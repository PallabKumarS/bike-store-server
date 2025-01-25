import express, { NextFunction, Request, Response } from 'express';
import { BikeController } from './bike.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createBikeValidationSchema,
  updateBikeValidationSchema,
} from './bike.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.get('/products', BikeController.getAllBike);
router.post(
  '/products',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
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
