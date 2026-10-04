import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CompanyAuthGuard } from '../../common/guards/company-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('PackagesController', () => {
  let controller: PackagesController;

  const mockPackagesService = {
    createPackage: jest.fn(),
    updatePackage: jest.fn(),
    deletePackage: jest.fn(),
    getPackagesByCompanyId: jest.fn(),
    getPackageById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagesController],
      providers: [
        {
          provide: PackagesService,
          useValue: mockPackagesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CompanyAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PackagesController>(PackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
