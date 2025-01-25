import { Schema, model } from 'mongoose';
import { IBike, TBike } from './bike.interface';

const bikeSchema = new Schema<TBike>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Mountain', 'Road', 'Hybrid', 'Electric'],
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true },
    image: { type: String },
  },
  { timestamps: true },
);

bikeSchema.statics.isBikeExists = async function (
  id: string,
): Promise<TBike | null> {
  return await BikeModel.findOne({ _id: id });
};

export const BikeModel = model<TBike, IBike>('Bike', bikeSchema);
