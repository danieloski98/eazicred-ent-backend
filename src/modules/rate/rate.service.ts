import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rate, RateDocument } from './schemas/rate.schema';
import { ReturnType } from '@/common/classes/ReturnType';

@Injectable()
export class RateService {
  constructor(
    @InjectModel(Rate.name)
    private readonly rateModel: Model<RateDocument>,
  ) {}

  async updateRate(rate: number) {
    const doc = await this.rateModel.findOneAndUpdate(
      { singleton: 'RATE_SINGLETON' },
      { rate },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return new ReturnType({
      statusCode: 200,
      message: 'Rate updated successfully',
      data: { rate: doc.rate },
    });
  }

  async getRate() {
    const doc = await this.rateModel.findOne({ singleton: 'RATE_SINGLETON' }).lean();
    return new ReturnType({
      statusCode: 200,
      message: 'Rate fetched successfully',
      data: { rate: doc?.rate ?? null },
    });
  }
}
