import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from '../../common/decorators/roles.decorator';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: UserRole.EMPLOYEE,
    save: jest.fn().mockResolvedValue(this),
    toObject: jest.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      role: UserRole.EMPLOYEE,
    }),
  };

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'hashedPassword',
        role: UserRole.EMPLOYEE,
      };

      const saveSpy = jest.fn().mockResolvedValue({
        ...userData,
        _id: '507f1f77bcf86cd799439011',
      });

      jest.spyOn(model, 'create' as any).mockImplementationOnce(() => ({
        save: saveSpy,
        ...userData,
      }));

      const result = await service.create(userData);

      expect(result).toBeDefined();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findById('nonexistentid');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser, { ...mockUser, email: 'user2@example.com' }];
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.findAll();

      expect(mockUserModel.find).toHaveBeenCalled();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { email: 'updated@example.com' };
      const updatedUser = { ...mockUser, ...updateData };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(userId, updateData);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateData,
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.update('nonexistentid', {});

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.delete(userId);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.delete('nonexistentid');

      expect(result).toBeNull();
    });
  });
});
