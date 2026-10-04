import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Package, PackageDocument } from './schema/schema';
import { Model, Types } from 'mongoose';
import { CreatePackageDto } from './dto/create-package-dto';
import { UpdatePackageDto } from './dto/update-package-dto';
import { ReturnType } from '../../common/classes/ReturnType';
import {
  Company,
  CompanyDocument,
} from '../companies/schemas/company.schema';

@Injectable()
export class PackagesService {
  private logger = new Logger(PackagesService.name);

  constructor(
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  /**
   * Verifies that the companyId is a valid ObjectId and exists in the database.
   */
  async verifyCompanyId(companyId: string): Promise<CompanyDocument> {
    if (!companyId || !Types.ObjectId.isValid(companyId)) {
      throw new BadRequestException('Invalid company ID');
    }

    const company = await this.companyModel.findById(companyId).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async createPackage(companyId: string, payload: CreatePackageDto) {
    try {
      await this.verifyCompanyId(companyId);

      const { duration, initialDeposit, name, totalPrice } = payload;

      const packageData = new this.packageModel({
        name,
        totalPrice,
        initialDeposit,
        companyId,
        durations: duration,
      });

      const savedPackage = await packageData.save();
      this.logger.log(`Package created successfully: ${savedPackage._id}`);
      return new ReturnType({
        message: 'Package created',
        statusCode: 201,
        data: savedPackage,
      });
    } catch (error) {
      this.logger.error('Failed to create package:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async updatePackage(id: string, payload: UpdatePackageDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid package ID');
      }

      const existingPackage = await this.packageModel.findById(id).exec();
      if (!existingPackage) {
        throw new NotFoundException('Package not found');
      }

      // Verify that the associated company exists
      await this.verifyCompanyId(existingPackage.companyId);

      const updateData: any = { ...payload };
      if (payload.duration !== undefined) {
        updateData.durations = payload.duration;
        delete updateData.duration;
      }

      const updatedPackage = await this.packageModel
        .findByIdAndUpdate(id, { $set: updateData }, { new: true })
        .exec();

      this.logger.log(`Package updated successfully: ${id}`);
      return new ReturnType({
        message: 'Package updated successfully',
        statusCode: 200,
        data: updatedPackage,
      });
    } catch (error) {
      this.logger.error(`Failed to update package with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async deletePackage(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid package ID');
      }

      const existingPackage = await this.packageModel.findById(id).exec();
      if (!existingPackage) {
        throw new NotFoundException('Package not found');
      }

      // Verify that the associated company exists
      await this.verifyCompanyId(existingPackage.companyId);

      const deletedPackage = await this.packageModel
        .findByIdAndDelete(id)
        .exec();

      this.logger.log(`Package deleted successfully: ${id}`);
      return new ReturnType({
        message: 'Package deleted successfully',
        statusCode: 200,
        data: deletedPackage,
      });
    } catch (error) {
      this.logger.error(`Failed to delete package with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async getPackagesByCompanyId(companyId: string) {
    try {
      await this.verifyCompanyId(companyId);

      const packages = await this.packageModel.find({ companyId }).exec();

      this.logger.log(
        `Found ${packages.length} packages for company: ${companyId}`,
      );
      return new ReturnType({
        message: 'Packages fetched successfully',
        statusCode: 200,
        data: packages,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch packages for company ${companyId}:`,
        error,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async getPackageById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid package ID');
      }

      const foundPackage = await this.packageModel.findById(id).exec();

      if (!foundPackage) {
        throw new NotFoundException('Package not found');
      }

      // Verify that the associated company exists
      await this.verifyCompanyId(foundPackage.companyId);

      this.logger.log(`Package retrieved successfully: ${id}`);
      return new ReturnType({
        message: 'Package fetched successfully',
        statusCode: 200,
        data: foundPackage,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch package with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw error;
    }
  }
}
