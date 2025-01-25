import { Model } from 'mongoose';

export type TBike = {
  name: string;
  brand: string;
  price: number;
  category: 'Mountain' | 'Road' | 'Hybrid' | 'Electric';
  description: string;
  quantity: number;
  inStock?: boolean;
  image: string;
};

export interface IBike extends Model<TBike> {
  // eslint-disable-next-line no-unused-vars
  isBikeExists(id: string): Promise<TBike>;
}
