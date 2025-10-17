import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company, CompanyDocument } from './schemas/company.schema';
import { UsersService } from '../users/users.service';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let model: Model<CompanyDocument>;
  let usersService: UsersService;

  const mockCompany = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'Test Company',
    hrUserId: new Types.ObjectId('507f1f77bcf86cd799439012'),
    employees: [],
    save: jest.fn().mockResolvedValue({}),
  };

  const mockCompanyModel = {
    new: jest.fn().mockResolvedValue(mockCompany),
    constructor: jest.fn().mockResolvedValue(mockCompany),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  const mockUsersService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    model = module.get<Model<CompanyDocument>>(getModelToken(Company.name));
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const createCompanyDto = { name: 'New Company' };
      const hrUserId = '507f1f77bcf86cd799439012';

      const saveSpy = jest.fn().mockResolvedValue(mockCompany);
      jest.spyOn(model, 'prototype' as any).mockImplementation(() => ({
        save: saveSpy,
      }));

      mockUsersService.update.mockResolvedValue({});

      // Mock the constructor
      const mockInstance = {
        ...mockCompany,
        save: saveSpy,
      };
      (model as any).mockImplementation(() => mockInstance);

      const result = await service.create(createCompanyDto, hrUserId);

      expect(usersService.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const companies = [mockCompany];
      mockCompanyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(companies),
        }),
      });

      const result = await service.findAll();

      expect(mockCompanyModel.find).toHaveBeenCalled();
      expect(result).toEqual(companies);
    });
  });

  describe('findById', () => {
    it('should return a company by id', async () => {
      const companyId = '507f1f77bcf86cd799439011';
      mockCompanyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCompany),
      });

      const result = await service.findById(companyId);

      expect(mockCompanyModel.findById).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(mockCompany);
    });

    it('should throw NotFoundException if company not found', async () => {
      mockCompanyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('nonexistentid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByHrUserId', () => {
    it('should find company by HR user id', async () => {
      const hrUserId = '507f1f77bcf86cd799439012';
      mockCompanyModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCompany),
      });

      const result = await service.findByHrUserId(hrUserId);

      expect(mockCompanyModel.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockCompany);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const companyId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439012';
      const updateDto = { name: 'Updated Company' };

      // Mock findById for authorization check
      mockCompanyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          ...mockCompany,
          hrUserId: { toString: () => userId },
        }),
      });

      // Mock findByIdAndUpdate
      mockCompanyModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockCompany, ...updateDto }),
      });

      const result = await service.update(companyId, updateDto, userId);

      expect(result).toBeDefined();
    });

    it('should throw ForbiddenException if user is not the HR', async () => {
      const companyId = '507f1f77bcf86cd799439011';
      const userId = 'differentUserId';
      const updateDto = { name: 'Updated Company' };

      mockCompanyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          ...mockCompany,
          hrUserId: { toString: () => '507f1f77bcf86cd799439012' },
        }),
      });

      await expect(
        service.update(companyId, updateDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a company', async () => {
      const companyId = '507f1f77bcf86cd799439011';

      mockCompanyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCompany),
      });

      mockCompanyModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCompany),
      });

      const result = await service.delete(companyId);

      expect(mockCompanyModel.findByIdAndDelete).toHaveBeenCalledWith(
        companyId,
      );
      expect(result).toBeDefined();
    });
  });

  describe('addEmployee', () => {
    it('should add an employee to company', async () => {
      const companyId = '507f1f77bcf86cd799439011';
      const employeeId = '507f1f77bcf86cd799439013';

      mockCompanyModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCompany),
      });

      const result = await service.addEmployee(companyId, employeeId);

      expect(mockCompanyModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException if company not found', async () => {
      mockCompanyModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addEmployee('nonexistent', 'employeeId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeEmployee', () => {
    it('should remove an employee from company', async () => {
      const companyId = '507f1f77bcf86cd799439011';
      const employeeId = '507f1f77bcf86cd799439013';

      mockCompanyModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCompany),
      });

      const result = await service.removeEmployee(companyId, employeeId);

      expect(mockCompanyModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException if company not found', async () => {
      mockCompanyModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.removeEmployee('nonexistent', 'employeeId'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
