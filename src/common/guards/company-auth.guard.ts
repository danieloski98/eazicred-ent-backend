import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Company,
  CompanyDocument,
} from '../../modules/companies/schemas/company.schema';
import {
  Package,
  PackageDocument,
} from '../../modules/packages/schema/schema';

@Injectable()
export class CompanyAuthGuard implements CanActivate {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    let targetCompanyId: string | undefined;

    if (request.params?.id) {
      const packageId = request.params.id;
      if (!Types.ObjectId.isValid(packageId)) {
        throw new BadRequestException('Invalid package ID');
      }

      const packageDoc = await this.packageModel.findById(packageId).exec();
      if (!packageDoc) {
        throw new NotFoundException('Package not found');
      }

      targetCompanyId = packageDoc.companyId;
      request.package = packageDoc;
    } else {
      targetCompanyId =
        request.params?.companyId ||
        request.query?.companyId ||
        request.body?.companyId;
    }

    if (!targetCompanyId) {
      throw new BadRequestException('Company ID is required');
    }

    if (!Types.ObjectId.isValid(targetCompanyId)) {
      throw new BadRequestException('Invalid company ID');
    }

    const company = await this.companyModel.findById(targetCompanyId).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    request.company = company;

    const userCompanyId = user.companyId ? user.companyId.toString() : null;
    const targetCompIdStr = company._id.toString();

    const isCompanyMember = userCompanyId === targetCompIdStr;
    const isCreator = company.creatorId?.toString() === user.userId?.toString();
    const isEmployee =
      Array.isArray(company.employees) &&
      company.employees.some(
        (empId) => empId?.toString() === user.userId?.toString(),
      );

    if (!isCompanyMember && !isCreator && !isEmployee) {
      throw new ForbiddenException(
        'You are not authorized to perform actions for this company',
      );
    }

    return true;
  }
}
