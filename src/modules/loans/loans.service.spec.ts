import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan, LoanStatus } from './schemas/loan.schema';
import { Company } from '../companies/schemas/company.schema';
import { User } from '../users/schemas/user.schema';
import { Admin } from '../admin-auth/schemas/admin.schema';
import { Package } from '../packages/schema/schema';
import { EmailService } from '../../common/services/email/email.service';

describe('LoansService', () => {
  let service: LoansService;

  const mockLoanId = new Types.ObjectId('507f1f77bcf86cd799439011');
  const mockCompanyId = new Types.ObjectId('507f1f77bcf86cd799439012');
  const mockPackageId = new Types.ObjectId('507f1f77bcf86cd799439013');

  const mockLoanDoc = {
    _id: mockLoanId,
    companyId: mockCompanyId,
    packageId: mockPackageId,
    amount: 50000,
    purpose: 'Medical emergency',
    status: LoanStatus.PENDING,
    hrApproved: false,
    tenure: 6,
    interest: 5,
    bvn: '12345678901',
    nin: '98765432101',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+2348012345678',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'John Doe',
    additionalInformation: 'Urgent loan request',
    utilityBills: ['https://example.com/bills/bill1.pdf'],
    bankRecords: ['https://example.com/records/statement.pdf'],
    toJSON: () => ({ ...mockLoanDoc }),
  };

  const mockCompanyDoc = {
    _id: mockCompanyId,
    name: 'Tech Innovations Ltd',
    industry: 'Fintech',
    toJSON: () => ({
      _id: mockCompanyId,
      name: 'Tech Innovations Ltd',
      industry: 'Fintech',
    }),
  };

  const mockPackageDoc = {
    _id: mockPackageId,
    companyId: mockCompanyId.toString(),
    name: 'Executive Medical Cover',
    totalPrice: 50000,
    initialDeposit: 5000,
  };

  const mockAdminDocs = [
    { name: 'Admin One', email: 'admin1@eazicred.com', toJSON: () => ({ email: 'admin1@eazicred.com', name: 'Admin One' }) },
    { name: 'Admin Two', email: 'admin2@eazicred.com', toJSON: () => ({ email: 'admin2@eazicred.com', name: 'Admin Two' }) },
  ];

  const mockLoanModel: any = {
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockCompanyModel: any = {
    findById: jest.fn(),
  };

  const mockUserModel: any = {
    find: jest.fn(),
  };

  const mockAdminModel: any = {
    find: jest.fn(),
  };

  const mockPackageModel: any = {
    findById: jest.fn(),
  };

  const mockEmailService = {
    sendCoachMail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: getModelToken(Loan.name),
          useValue: mockLoanModel,
        },
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Admin.name),
          useValue: mockAdminModel,
        },
        {
          provide: getModelToken(Package.name),
          useValue: mockPackageModel,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateLoanStatus', () => {
    it('should throw BadRequestException if loanId is invalid', async () => {
      await expect(service.updateLoanStatus('invalid-id', LoanStatus.APPROVED)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if status value is not allowed', async () => {
      await expect(
        service.updateLoanStatus(mockLoanId.toString(), LoanStatus.PENDING as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if loan is not found', async () => {
      mockLoanModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateLoanStatus(mockLoanId.toString(), LoanStatus.APPROVED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should approve loan, set hrApproved: true, and notify all admin emails with full details', async () => {
      const approvedDoc = {
        ...mockLoanDoc,
        status: LoanStatus.APPROVED,
        hrApproved: true,
      };

      mockLoanModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(approvedDoc),
      });
      mockAdminModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAdminDocs),
      });
      mockCompanyModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCompanyDoc),
      });
      mockPackageModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPackageDoc),
      });

      const result = await service.updateLoanStatus(
        mockLoanId.toString(),
        LoanStatus.APPROVED,
      );

      // Verify DB update
      expect(mockLoanModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockLoanId.toString(),
        { $set: { status: LoanStatus.APPROVED, hrApproved: true } },
        { new: true },
      );
      expect(result.status).toBe(LoanStatus.APPROVED);

      // Verify email calls: 1 to applicant, 1 to all admins
      expect(mockEmailService.sendCoachMail).toHaveBeenCalledTimes(2);

      // 1st call: applicant
      expect(mockEmailService.sendCoachMail).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          emails: [mockLoanDoc.email],
          subject: 'Loan Application Approved',
        }),
      );

      // 2nd call: all admins
      const expectedAdminEmails = [
        'underwriter@eazicred.com',
        'admin1@eazicred.com',
        'admin2@eazicred.com',
      ];
      expect(mockEmailService.sendCoachMail).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          emails: expectedAdminEmails,
          subject: expect.stringContaining('Loan Approved Notification - John Doe (Tech Innovations Ltd)'),
          body: expect.stringContaining('LOAN APPROVED BY COMPANY'),
          html: expect.stringContaining('Tech Innovations Ltd'),
        }),
      );

      // Verify HTML and text contain key loan details
      const adminEmailCall = mockEmailService.sendCoachMail.mock.calls[1][0];
      expect(adminEmailCall.body).toContain('Medical emergency');
      expect(adminEmailCall.body).toContain('Access Bank');
      expect(adminEmailCall.body).toContain('0123456789');
      expect(adminEmailCall.body).toContain('Executive Medical Cover');
      expect(adminEmailCall.html).toContain('₦50,000.00');
      expect(adminEmailCall.html).toContain('John Doe');
      expect(adminEmailCall.html).toContain('https://example.com/bills/bill1.pdf');
    });

    it('should notify applicant on REJECTED and not notify admins', async () => {
      const rejectedDoc = {
        ...mockLoanDoc,
        status: LoanStatus.REJECTED,
      };

      mockLoanModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(rejectedDoc),
      });

      await service.updateLoanStatus(mockLoanId.toString(), LoanStatus.REJECTED);

      // Verify only applicant email sent
      expect(mockEmailService.sendCoachMail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendCoachMail).toHaveBeenCalledWith({
        emails: [rejectedDoc.email],
        subject: 'Loan Application Rejected',
        body: expect.stringContaining('we are sorry to inform you'),
      });
      expect(mockAdminModel.find).not.toHaveBeenCalled();
    });
  });
});
