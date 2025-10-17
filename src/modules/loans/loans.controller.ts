import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { LoanStatus } from './schemas/loan.schema';
import { UpdateLoanStatusDto } from './dto/update-loan-status.dto';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Public: Apply for a loan' })
  async apply(@Body() dto: CreateLoanDto) {
    return this.loansService.createPublicLoan(dto);
  }

  @Get('company/:companyId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR, UserRole.LOAN_COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated loans for a company' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: LoanStatus })
  async getCompanyLoans(
    @Param('companyId') companyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: LoanStatus,
  ) {
    return this.loansService.getLoansByCompanyPaginated(
      companyId,
      Number(page) || 1,
      Number(limit) || 10,
      status,
    );
  }

  @Patch(':loanId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR, UserRole.LOAN_COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update loan status and notify applicant' })
  async updateStatus(
    @Param('loanId') loanId: string,
    @Body() dto: UpdateLoanStatusDto,
  ) {
    return this.loansService.updateLoanStatus(loanId, dto.status);
  }

  @Get('company/:companyId/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR, UserRole.LOAN_COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get loan analytics for a company' })
  async getCompanyAnalytics(@Param('companyId') companyId: string) {
    return this.loansService.getCompanyLoanAnalytics(companyId);
  }
}
