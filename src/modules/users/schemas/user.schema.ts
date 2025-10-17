import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../../../common/decorators/roles.decorator';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, enum: UserRole, type: String, default: UserRole.HR })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
  companyId?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
