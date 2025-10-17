import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LoanStatus } from '../schemas/loan.schema';

export class UpdateLoanStatusDto {
  @ApiProperty({
    enum: LoanStatus,
    example: LoanStatus.APPROVED,
    description: 'New status for the loan',
  })
  @IsEnum(LoanStatus)
  status: LoanStatus;
}