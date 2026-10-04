import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from './schema/schema';
import { Company, CompanySchema } from '../companies/schemas/company.schema';
import { CompanyAuthGuard } from '../../common/guards/company-auth.guard';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, CompanyAuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: Package.name, schema: PackageSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  exports: [PackagesService, CompanyAuthGuard],
})
export class PackagesModule {}
