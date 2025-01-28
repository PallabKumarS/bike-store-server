import { Model, Types } from 'mongoose';

export type TBike = {
  name: string;
  brand: string;
  price: number;
  category: 'Mountain' | 'Hybrid' | 'Electric' | 'Sport';
  description: string;
  quantity: number;
  inStock?: boolean;
  image: string;
};

export interface IBike extends Model<TBike> {
  // eslint-disable-next-line no-unused-vars
  isBikeExists(id: Types.ObjectId): Promise<TBike>;
}
