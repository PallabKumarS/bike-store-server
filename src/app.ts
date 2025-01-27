/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { BikeRoutes } from './app/modules/bikes/bike.route';
import { OrderRoutes } from './app/modules/orders/order.route';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import { UserRoutes } from './app/modules/user/user.route';
import { AuthRoutes } from './app/modules/auth/auth.route';

const app: Application = express();

// parsers
app.use(
  cors({
    origin: [
      (config.local_client as string) ||
        'https://pks-bike-store-client.vercel.app',
      (config.client as string) || 'http://localhost:5173',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use('/api', BikeRoutes);
app.use('/api', OrderRoutes);
app.use('/api', UserRoutes);
app.use('/api', AuthRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Bike Store Server Is Running');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
