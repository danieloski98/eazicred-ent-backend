import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, set: (v: string) => v.toLowerCase().trim() })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    required: false,
    default: new Date().toISOString(),
  })
  createdAt: string;

  @Prop({
    type: String,
    default: new Date().toISOString(),
    set: (v: string) => new Date().toISOString(),
  })
  updatedAt: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
