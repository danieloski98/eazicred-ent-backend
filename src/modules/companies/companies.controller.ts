import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get company by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.companiesService.getCompanyBySlug(slug);
  }

  @Patch(':id')
  @Roles(UserRole.HR)
  @ApiOperation({ summary: 'Update company (HR only)' })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: any,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.LOAN_COMPANY)
  @ApiOperation({ summary: 'Delete company (Admin only)' })
  remove(@Param('id') id: string) {
    return this.companiesService.delete(id);
  }
}
