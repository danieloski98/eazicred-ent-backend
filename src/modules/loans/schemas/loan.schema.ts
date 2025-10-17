import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FUNDED = 'FUNDED',
  REPAID = 'REPAID',
}

export type LoanDocument = Loan & Document;

@Schema({ timestamps: true })
export class Loan {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true, enum: LoanStatus, default: LoanStatus.PENDING })
  status: LoanStatus;

  @Prop({ default: false })
  hrApproved: boolean;

  @Prop({ required: true, type: Number })
  tenure: number;

  @Prop({ required: true, type: Number })
  interest: number;

  @Prop({ required: true, type: String })
  bvn: string;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String })
  additionalInformation: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: true, type: Number, default: 0 })
  totalAmountPaid: number;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);
