import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum OTP_TYPE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type Otpocument = HydratedDocument<Otp>;

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  code: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  expired: boolean;

  @Prop({
    type: String,
    default: new Date().toISOString(),
  })
  createdAt: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
