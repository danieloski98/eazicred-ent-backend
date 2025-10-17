import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan, LoanDocument, LoanStatus } from './schemas/loan.schema';
import { EmployeesService } from '../employees/employees.service';

describe('LoansService', () => {
  let service: LoansService;
  let model: Model<LoanDocument>;
  let employeesService: EmployeesService;

  const mockLoan = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    employeeId: new Types.ObjectId('507f1f77bcf86cd799439012'),
    companyId: new Types.ObjectId('507f1f77bcf86cd799439013'),
    amount: 5000,
    purpose: 'Home renovation',
    status: LoanStatus.PENDING,
    hrApproved: false,
    loanCompanyApproved: false,
    save: jest.fn(),
  };

  const mockEmployee = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
    companyId: new Types.ObjectId('507f1f77bcf86cd799439013'),
    userId: new Types.ObjectId('507f1f77bcf86cd799439014'),
  };

  const mockLoanModel = {
    new: jest.fn().mockResolvedValue(mockLoan),
    constructor: jest.fn().mockResolvedValue(mockLoan),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
    exec: jest.fn(),
  };

  const mockEmployeesService = {
    findByUserId: jest.fn(),
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
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
    model = module.get<Model<LoanDocument>>(getModelToken(Loan.name));
    employeesService = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new loan application', async () => {
      const createLoanDto = {
        amount: 5000,
        purpose: 'Home renovation',
      };
      const userId = '507f1f77bcf86cd799439014';

      mockEmployeesService.findByUserId.mockResolvedValue(mockEmployee);

      const saveSpy = jest.fn().mockResolvedValue(mockLoan);
      (model as any).mockImplementation(() => ({
        ...mockLoan,
        save: saveSpy,
      }));

      const result = await service.create(createLoanDto, userId);

      expect(employeesService.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should throw ForbiddenException if user is not an employee', async () => {
      const createLoanDto = {
        amount: 5000,
        purpose: 'Home renovation',
      };

      mockEmployeesService.findByUserId.mockResolvedValue(null);

      await expect(service.create(createLoanDto, 'userId')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findMyLoans', () => {
    it('should return loans for an employee', async () => {
      const userId = '507f1f77bcf86cd799439014';
      const loans = [mockLoan];

      mockEmployeesService.findByUserId.mockResolvedValue(mockEmployee);
      mockLoanModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(loans),
      });

      const result = await service.findMyLoans(userId);

      expect(employeesService.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(loans);
    });

    it('should throw ForbiddenException if user is not an employee', async () => {
      mockEmployeesService.findByUserId.mockResolvedValue(null);

      await expect(service.findMyLoans('userId')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findCompanyLoans', () => {
    it('should return all loans for a company', async () => {
      const companyId = '507f1f77bcf86cd799439013';
      const loans = [mockLoan];

      mockLoanModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(loans),
      });

      const result = await service.findCompanyLoans(companyId);

      expect(mockLoanModel.find).toHaveBeenCalled();
      expect(result).toEqual(loans);
    });
  });

  describe('findAll', () => {
    it('should return all loans', async () => {
      const loans = [mockLoan];

      mockLoanModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(loans),
      });

      const result = await service.findAll();

      expect(mockLoanModel.find).toHaveBeenCalled();
      expect(result).toEqual(loans);
    });
  });

  describe('findApprovedLoans', () => {
    it('should return HR-approved loans', async () => {
      const loans = [{ ...mockLoan, hrApproved: true, status: LoanStatus.APPROVED }];

      mockLoanModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(loans),
      });

      const result = await service.findApprovedLoans();

      expect(mockLoanModel.find).toHaveBeenCalled();
      expect(result).toEqual(loans);
    });
  });

  describe('findById', () => {
    it('should return a loan by id', async () => {
      const loanId = '507f1f77bcf86cd799439011';

      mockLoanModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockLoan),
      });

      const result = await service.findById(loanId);

      expect(mockLoanModel.findById).toHaveBeenCalledWith(loanId);
      expect(result).toEqual(mockLoan);
    });

    it('should throw NotFoundException if loan not found', async () => {
      mockLoanModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('approveLoan', () => {
    it('should approve a pending loan', async () => {
      const loanId = '507f1f77bcf86cd799439011';
      const companyId = '507f1f77bcf86cd799439013';

      const pendingLoan = {
        ...mockLoan,
        status: LoanStatus.PENDING,
        companyId: { toString: () => companyId },
        save: jest.fn().mockResolvedValue(mockLoan),
      };

      mockLoanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(pendingLoan),
      });

      const result = await service.approveLoan(loanId, companyId);

      expect(pendingLoan.save).toHaveBeenCalled();
      expect(pendingLoan.hrApproved).toBe(true);
      expect(pendingLoan.status).toBe(LoanStatus.APPROVED);
    });

    it('should throw ForbiddenException if company does not match', async () => {
      const loanId = '507f1f77bcf86cd799439011';
      const companyId = 'differentCompanyId';

      mockLoanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockLoan,
          companyId: { toString: () => '507f1f77bcf86cd799439013' },
        }),
      });

      await expect(service.approveLoan(loanId, companyId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if loan is not pending', async () => {
      const loanId = '507f1f77bcf86cd799439011';
      const companyId = '507f1f77bcf86cd799439013';

      mockLoanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockLoan,
          status: LoanStatus.APPROVED,
          companyId: { toString: () => companyId },
        }),
      });

      await expect(service.approveLoan(loanId, companyId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('rejectLoan', () => {
    it('should reject a pending loan', async () => {
      const loanId = '507f1f77bcf86cd799439011';
      const companyId = '507f1f77bcf86cd799439013';

      const pendingLoan = {
        ...mockLoan,
        status: LoanStatus.PENDING,
        companyId: { toString: () => companyId },
        save: jest.fn().mockResolvedValue(mockLoan),
      };

      mockLoanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(pendingLoan),
      });

      const result = await service.rejectLoan(loanId, companyId);

      expect(pendingLoan.save).toHaveBeenCalled();
      expect(pendingLoan.status).toBe(LoanStatus.REJECTED);
    });
  });

  describe('fundLoan', () => {
    it('should fund an approved loan', async () => {
      const loanId = '507f1f77bcf86cd799439011';

      const approvedLoan = {
        ...mockLoan,
        status: LoanStatus.APPROVED,
        hrApproved: true,
        save: jest.fn().mockResolvedValue(mockLoan),
      };

      mockLoanModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(approvedLoan),
      });

      const result = await service.fundLoan(loanId);

      expect(approvedLoan.save).toHaveBeenCalled();
      expect(approvedLoan.loanCompanyApproved).toBe(true);
      expect(approvedLoan.status).toBe(LoanStatus.FUNDED);
    });

    it('should throw BadRequestException if loan is not approved', async () => {
      mockLoanModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          ...mockLoan,
          status: LoanStatus.PENDING,
          hrApproved: false,
        }),
      });

      await expect(service.fundLoan('loanId')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('repayLoan', () => {
    it('should mark a funded loan as repaid', async () => {
      const loanId = '507f1f77bcf86cd799439011';

      const fundedLoan = {
        ...mockLoan,
        status: LoanStatus.FUNDED,
        save: jest.fn().mockResolvedValue(mockLoan),
      };

      mockLoanModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(fundedLoan),
      });

      const result = await service.repayLoan(loanId);

      expect(fundedLoan.save).toHaveBeenCalled();
      expect(fundedLoan.status).toBe(LoanStatus.REPAID);
    });

    it('should throw BadRequestException if loan is not funded', async () => {
      mockLoanModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          ...mockLoan,
          status: LoanStatus.APPROVED,
        }),
      });

      await expect(service.repayLoan('loanId')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
