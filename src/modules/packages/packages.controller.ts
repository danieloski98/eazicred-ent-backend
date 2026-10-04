import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package-dto';
import { UpdatePackageDto } from './dto/update-package-dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CompanyAuthGuard } from '../../common/guards/company-auth.guard';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post(':companyId')
  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new package for a company' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  createPackage(
    @Param('companyId') companyId: string,
    @Body() payload: CreatePackageDto,
  ) {
    return this.packagesService.createPackage(companyId, payload);
  }

  @Post('company/:companyId')
  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new package for a company' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  createPackageForCompany(
    @Param('companyId') companyId: string,
    @Body() payload: CreatePackageDto,
  ) {
    return this.packagesService.createPackage(companyId, payload);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get list of packages by company ID' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  getPackagesByCompanyId(@Param('companyId') companyId: string) {
    return this.packagesService.getPackagesByCompanyId(companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of packages by company ID query parameter' })
  @ApiQuery({ name: 'companyId', required: true, description: 'Company ID' })
  getPackagesByQuery(@Query('companyId') companyId: string) {
    return this.packagesService.getPackagesByCompanyId(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single package by ID' })
  @ApiParam({ name: 'id', description: 'Package ID' })
  getPackageById(@Param('id') id: string) {
    return this.packagesService.getPackageById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a package by ID' })
  @ApiParam({ name: 'id', description: 'Package ID' })
  updatePackage(
    @Param('id') id: string,
    @Body() payload: UpdatePackageDto,
  ) {
    return this.packagesService.updatePackage(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CompanyAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a package by ID' })
  @ApiParam({ name: 'id', description: 'Package ID' })
  deletePackage(@Param('id') id: string) {
    return this.packagesService.deletePackage(id);
  }
}
