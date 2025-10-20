import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { Loan, LoanDocument, LoanStatus } from '../loans/schemas/loan.schema';
import { ReturnType } from '@/common/classes/ReturnType';

@Injectable()
export class AnalyticsService {
  private logger = new Logger(AnalyticsService.name);
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Loan.name) private readonly loanModel: Model<LoanDocument>,
  ) {}

  async getSummary() {
    const [totalCompanies, totalApprovedLoans, amountAgg] = await Promise.all([
      this.companyModel.countDocuments().exec(),
      this.loanModel.countDocuments({ status: LoanStatus.APPROVED }).exec(),
      this.loanModel
        .aggregate([
          { $match: { status: LoanStatus.APPROVED } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        .exec(),
    ]);

    const totalAmountOfApprovedLoans = amountAgg?.[0]?.total || 0;

    return new ReturnType({
      message: 'Analytics summary fetched',
      statusCode: 200,
      data: {
        totalCompanies,
        totalApprovedLoans,
        totalAmountOfApprovedLoans,
      },
    });
  }
}
