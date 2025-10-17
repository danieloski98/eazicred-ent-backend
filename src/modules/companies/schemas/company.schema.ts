import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, set: (v: string) => v.toLowerCase().trim() })
  name: string;

  @Prop({ required: true })
  industry: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  creatorId: string;

  @Prop({
    required: false,
    set: (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, ''),
  })
  slug: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  employees: Types.ObjectId[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
