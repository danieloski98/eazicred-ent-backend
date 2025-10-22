import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated companies' })
  findAll(@Query() query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    return this.companiesService.findAll({ page, limit });
  }

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

  @Get('hr/:hrUserId')
  @Roles(UserRole.HR)
  @ApiOperation({ summary: 'Get company by HR user ID (HR only)' })
  findByHrUserId(@Param('hrUserId') hrUserId: string) {
    return this.companiesService.findByHrUserId(hrUserId);
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
