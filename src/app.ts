/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { BikeRoutes } from './app/modules/bikes/bike.route';
import { OrderRoutes } from './app/modules/orders/order.route';

const app: Application = express();

// parsers
app.use(cors());
app.use(express.json());

app.use('/api', BikeRoutes);
app.use('/api', OrderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Bike Store Server Is Running');
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err: Error & { status?: number } = new Error(
    `The Requested URL [${req.url}] Is Invalid`,
  );
  err.status = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
  next();
});

export default app;
