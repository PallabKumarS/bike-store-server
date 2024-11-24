import express from 'express';
import { BikeController } from './bike.controller';

const router = express.Router();

router.get('/products', BikeController.getAllBike);
router.post('/products', BikeController.createBike);
router.get('/products/:productId', BikeController.getSingleBike);
router.put('/products/:productId', BikeController.updateBike);
router.delete('/products/:productId', BikeController.deleteBike);

export const BikeRoutes = router;
