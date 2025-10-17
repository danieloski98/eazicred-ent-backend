import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Loan, LoanDocument, LoanStatus } from './schemas/loan.schema';
import { CreateLoanDto } from './dto/create-loan.dto';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { EmailService } from '@/common/services/email/email.service';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService,
  ) {}

  // Public: Create a loan application after validating companyId
  async createPublicLoan(dto: CreateLoanDto) {
    const { companyId } = dto;

    if (!companyId || !Types.ObjectId.isValid(companyId)) {
      throw new BadRequestException('Invalid company ID');
    }

    const company = await this.companyModel.findById(companyId).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const payload = {
      ...dto,
      companyId: new Types.ObjectId(companyId),
      status: LoanStatus.PENDING,
      hrApproved: false,
    } as any;

    const created = new this.loanModel(payload);
    await created.save();

    // Notify all users in the company about the new application (non-blocking)
    try {
      const companyUsers = await this.userModel
        .find({ companyId: company._id })
        .select('email fullname')
        .exec();

      const subject = 'New Loan Application Submitted';
      const body = `Hello,\n\nA new loan application has been submitted for ${company.name}.\n\nApplicant: ${created.firstName} ${created.lastName}\nAmount: ${created.amount}\nPurpose: ${created.purpose}\nTenure: ${created.tenure} months\nInterest: ${created.interest}%\nContact: ${created.email} / ${created.phone}\n\nYou can review the application in your dashboard.`;

      const emails = companyUsers.map(
        (u: UserDocument) => u.toJSON().email,
      ) as any[];
      await this.emailService.sendCoachMail({ emails, subject, body });
    } catch (err) {
      // Swallow email errors to avoid impacting creation
    }

    return created;
  }

  // Auth: Get paginated loans by company with optional status filter
  async getLoansByCompanyPaginated(
    companyId: string,
    page = 1,
    limit = 10,
    status?: LoanStatus,
  ) {
    if (!companyId || !Types.ObjectId.isValid(companyId)) {
      throw new BadRequestException('Invalid company ID');
    }

    const companyExists = await this.companyModel.findById(companyId).exec();
    if (!companyExists) {
      throw new NotFoundException('Company not found');
    }

    const filter: any = { companyId: new Types.ObjectId(companyId) };
    if (status) {
      filter.status = status;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const items = await this.loanModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .exec();

    const total = await this.loanModel.countDocuments(filter).exec();

    const pages = Math.max(1, Math.ceil(total / limitNum));
    return { items, total, page: pageNum, limit: limitNum, pages };
  }

  // Auth: Update loan status and notify applicant on APPROVED/REJECTED
  async updateLoanStatus(loanId: string, status: LoanStatus) {
    if (!loanId || !Types.ObjectId.isValid(loanId)) {
      throw new BadRequestException('Invalid loan ID');
    }

    const allowedStatuses = [
      LoanStatus.APPROVED,
      LoanStatus.REJECTED,
      LoanStatus.FUNDED,
      LoanStatus.REPAID,
    ];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    const updated = await this.loanModel
      .findByIdAndUpdate(loanId, { $set: { status } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Loan not found');
    }

    // Notify applicant if status is approved or rejected
    try {
      if (status === LoanStatus.APPROVED) {
        await this.emailService.sendCoachMail({
          emails: [updated.email],
          subject: 'Loan Application Approved',
          body: `Hi ${updated.firstName}, your loan application has been approved. We will contact you shortly with next steps.`,
        });
      } else if (status === LoanStatus.REJECTED) {
        await this.emailService.sendCoachMail({
          emails: [updated.email],
          subject: 'Loan Application Rejected',
          body: `Hi ${updated.firstName}, we are sorry to inform you that your loan application was not approved at this time.`,
        });
      }
    } catch (err) {
      // Do not fail the request due to email failure
    }

    return updated;
  }

  // Auth: Loan analytics for a company
  async getCompanyLoanAnalytics(companyId: string) {
    if (!companyId || !Types.ObjectId.isValid(companyId)) {
      throw new BadRequestException('Invalid company ID');
    }

    const companyExists = await this.companyModel.findById(companyId).exec();
    if (!companyExists) {
      throw new NotFoundException('Company not found');
    }

    const companyObjectId = new Types.ObjectId(companyId);

    const totalLoans = await this.loanModel
      .countDocuments({ companyId: companyObjectId })
      .exec();
    const totalAccepted = await this.loanModel
      .countDocuments({
        companyId: companyObjectId,
        status: LoanStatus.APPROVED,
      })
      .exec();
    const totalRejected = await this.loanModel
      .countDocuments({
        companyId: companyObjectId,
        status: LoanStatus.REJECTED,
      })
      .exec();

    const percentageAccepted =
      totalLoans === 0
        ? 0
        : parseFloat(((totalAccepted / totalLoans) * 100).toFixed(2));

    return {
      totalLoans,
      totalAccepted,
      totalRejected,
      percentageAccepted,
    };
  }
}
