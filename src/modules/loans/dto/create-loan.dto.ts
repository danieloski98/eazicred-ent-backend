import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  IsMongoId,
  IsEmail,
} from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the company requesting the loan',
  })
  @IsMongoId()
  companyId: string;

  @ApiProperty({ example: 5000, description: 'Loan amount' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    example: 'Home renovation',
    description: 'Purpose of the loan',
  })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({ example: 12, description: 'Loan tenure in months' })
  @IsNumber()
  @Min(1)
  tenure: number;

  @ApiProperty({ example: 5, description: 'Interest rate percentage' })
  @IsNumber()
  @Min(0)
  interest: number;

  @ApiProperty({ example: '12345678901', description: 'Borrower BVN' })
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @ApiProperty({ example: 'John', description: 'Borrower first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Borrower last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'Monthly repayment from salary.',
    description: 'Any additional information provided by the borrower',
  })
  @IsString()
  @IsNotEmpty()
  additionalInformation: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Borrower email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+2348012345678',
    description: 'Borrower phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
