import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Duration {
    @Prop({
        required: true,
        type: Number
    })
    duration: number;

    @Prop({
        required: true,
        type: Number,
    })
    price: number
}

@Schema({ collection: 'packages', timestamps: true })
export class Package {
    @Prop({
        required: true,
        type: String,
    })
    companyId: string;

    @Prop({
        required: true,
        type: String,
    })
    name: string;

    @Prop()
    totalPrice: number;

    @Prop({
        required: true,
        type: Number,
    })
    initialDeposit: number;

    @Prop({
        required: true,
        type: [Duration],
        default: []
    })
    durations: Duration[];

}

export type PackageDocument = HydratedDocument<Package>;
export const PackageSchema = SchemaFactory.createForClass(Package);
