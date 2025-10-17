import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class CompaniesService {
  private logger = new Logger(CompaniesService.name);
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async getCompanyBySlug(slug: string) {
    try {
      const company = await this.companyModel
        .find({ slug })
        .populate('hrUserId', '-password')
        .exec();

      if (!company) {
        throw new NotFoundException('Company not found');
      }
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        'Error occured while getting company by slug',
      );
    }
  }

  async findById(id: string) {
    const company = await this.companyModel
      .findById(id)
      .populate('hrUserId', '-password')
      .populate('employees')
      .exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async findByHrUserId(hrUserId: string) {
    const res = await this.companyModel
      .findOne({ creatorId: new Types.ObjectId(hrUserId) })
      .exec();
    return res;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, userId: string) {
    const company = await this.findById(id);
    if (company.creatorId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own company');
    }
    const updated = await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Company not found');
    }
    return updated;
  }

  async delete(id: string) {
    const company = await this.findById(id);
    const deleted = await this.companyModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Company not found');
    }
    return deleted;
  }
}
