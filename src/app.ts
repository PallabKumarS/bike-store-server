/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { BikeRoutes } from './app/modules/bikes/bike.route';
import { OrderRoutes } from './app/modules/orders/order.route';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// parsers
app.use(
  cors({
    origin: [config.local_client as string, config.client as string],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api', BikeRoutes);
app.use('/api', OrderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Bike Store Server Is Running');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
