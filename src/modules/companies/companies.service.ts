import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UsersService } from '../../modules/users/users.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Loan, LoanDocument } from '../loans/schemas/loan.schema';
import { ReturnType } from '@/common/classes/ReturnType';

@Injectable()
export class CompaniesService {
  private logger = new Logger(CompaniesService.name);
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
  ) {}

  private async enrichedCompany(company: CompanyDocument) {
    try {
      const creator = await this.userModel.findById(company?.creatorId);
      const totalLoans = await this.loanModel.countDocuments({
        companyId: company._id,
      });

      return {
        ...company.toObject(),
        creator,
        totalLoans,
        tenure: company.tenure || 1,
      };
    } catch (error) {}
  }

  async getCompanyBySlug(slug: string) {
    try {
      const company = await this.companyModel.findOne({ slug }).exec();

      if (!company) {
        throw new NotFoundException('Company not found');
      }
      this.logger.error(company);
      const enrichedCompany = await this.enrichedCompany(company as any);
      this.logger.debug('enriched company', enrichedCompany);
      return new ReturnType({
        statusCode: 200,
        data: enrichedCompany,
        message: 'Company fetched successfully',
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        'Error occured while getting company by slug',
      );
    }
  }

  async findById(id: string) {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const enrichedCompany = await this.enrichedCompany(company as any);

    return new ReturnType({
      statusCode: 200,
      data: enrichedCompany,
      message: 'Company fetched successfully',
    });
  }

  async findByHrUserId(hrUserId: string) {
    const res = await this.companyModel
      .findOne({ creatorId: new Types.ObjectId(hrUserId) })
      .exec();
    if (!res) {
      throw new NotFoundException('Company not found');
    }

    const enrichedCompany = await this.enrichedCompany(res as any);

    return new ReturnType({
      statusCode: 200,
      data: enrichedCompany,
      message: 'Company fetched successfully',
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, userId: string) {
    const company = await this.companyModel.findById(id).exec();
    if (company.creatorId !== userId) {
      throw new UnauthorizedException('You can only update your own company');
    }
    const updated = await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Company not found');
    }

    const enrichedCompany = await this.enrichedCompany(updated as any);

    return new ReturnType({
      statusCode: 200,
      data: enrichedCompany,
      message: 'Company updated successfully',
    });
  }

  async delete(id: string) {
    const company = await this.findById(id);
    const deleted = await this.companyModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Company not found');
    }
    return deleted;
  }

  // New: Paginated list of all companies
  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.companyModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.companyModel.countDocuments().exec(),
    ]);

    const enriched = await Promise.all(
      items.map((c) => this.enrichedCompany(c as any)),
    );

    const totalPages = Math.ceil(total / limit) || 1;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return new ReturnType({
      statusCode: 200,
      message: 'Companies fetched successfully',
      data: {
        items: enriched,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  }
}
