import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RateDocument = Rate & Document;

@Schema({ timestamps: true })
export class Rate {
  @Prop({ required: true, unique: true, default: 'RATE_SINGLETON' })
  singleton: string;

  @Prop({ required: true })
  rate: number;
}

export const RateSchema = SchemaFactory.createForClass(Rate);

// Ensure only one document exists for the singleton key
RateSchema.index({ singleton: 1 }, { unique: true });