import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PackagesService } from './packages.service';
import { Package } from './schema/schema';
import { Company } from '../companies/schemas/company.schema';

describe('PackagesService', () => {
  let service: PackagesService;

  const mockPackageModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCompanyModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: getModelToken(Package.name),
          useValue: mockPackageModel,
        },
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
