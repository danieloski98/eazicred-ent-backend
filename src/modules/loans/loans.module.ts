import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan, LoanSchema } from './schemas/loan.schema';
import { Company, CompanySchema } from '../companies/schemas/company.schema';
import { EmailService } from '@/common/services/email/email.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Loan.name, schema: LoanSchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [LoansController],
  providers: [LoansService, EmailService],
  exports: [LoansService],
})
export class LoansModule {}
