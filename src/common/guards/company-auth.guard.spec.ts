import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompanyAuthGuard } from './company-auth.guard';
import { Company } from '../../modules/companies/schemas/company.schema';
import { Package } from '../../modules/packages/schema/schema';
import { ExecutionContext, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('CompanyAuthGuard', () => {
  let guard: CompanyAuthGuard;

  const mockCompanyModel = {
    findById: jest.fn(),
  };

  const mockPackageModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyAuthGuard,
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
        {
          provide: getModelToken(Package.name),
          useValue: mockPackageModel,
        },
      ],
    }).compile();

    guard = module.get<CompanyAuthGuard>(CompanyAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no user', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ params: {} }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should allow user if user companyId matches company _id', async () => {
    const companyId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    mockCompanyModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: { toString: () => companyId },
        creatorId: new Types.ObjectId().toString(),
        employees: [],
      }),
    });

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId, companyId },
          params: { companyId },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user is not part of the company', async () => {
    const companyId = new Types.ObjectId().toString();
    const differentCompanyId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    mockCompanyModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: { toString: () => companyId },
        creatorId: new Types.ObjectId().toString(),
        employees: [],
      }),
    });

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId, companyId: differentCompanyId },
          params: { companyId },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
