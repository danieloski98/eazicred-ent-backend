import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { Rate, RateSchema } from './schemas/rate.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rate.name, schema: RateSchema }])],
  controllers: [RateController],
  providers: [RateService]
})
export class RateModule {}
