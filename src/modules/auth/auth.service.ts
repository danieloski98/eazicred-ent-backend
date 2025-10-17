import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types, Model, Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../modules/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { RegisterCompanyAndUserDto } from './dto/register-company-user.dto';
import { ReturnType } from 'src/common/classes/ReturnType';
import { OtpService } from '@/common/services/otp/otp.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectConnection() private readonly connection: Connection,
    private otpService: OtpService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.otpService.createOtp({ userId: user?._id.toString() as string });

    return new ReturnType({
      message: 'OTP sent to email',
      statusCode: 200,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  }

  async validateOtp({ userId, otp }: { userId: string; otp: string }) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValid = await this.otpService.verifyOtp({ code: otp });
      if (!isValid) {
        throw new UnauthorizedException('Invalid OTP');
      }

      const payload = { email: user.email, sub: user._id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        },
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid OTP');
    }
  }

  /**
   * Create a user, then a company in a single MongoDB transaction.
   * If any step fails, the whole operation is rolled back.
   * After company creation, update the user with the new companyId.
   */
  async registerCompanyAndUser(dto: RegisterCompanyAndUserDto) {
    const { user: userPayload, company: companyPayload } = dto;

    // Check for existing email before starting transaction
    const existing = await this.usersService.findByEmail(userPayload.email);
    const companyExist = await this.companyModel.find({
      name: companyPayload.name,
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    if (companyExist.length > 0) {
      throw new ConflictException('Company name already exists');
    }

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const createdUser = await new this.userModel({
        email: userPayload.email,
        fullname: userPayload.fullname,
        role: userPayload.role,
      }).save({ session });

      // Compute a slug from company name if provided; schema allows optional slug
      const slug =
        typeof companyPayload?.name === 'string'
          ? companyPayload.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          : undefined;

      const createdCompany = await new this.companyModel({
        name: companyPayload.name,
        industry: companyPayload.industry,
        slug,
        logo: companyPayload.logo,
        creatorId: createdUser._id,
      }).save({ session });

      const updatedUser = await this.userModel.findByIdAndUpdate(
        createdUser._id,
        { companyId: createdCompany._id as Types.ObjectId },
        { new: true, session },
      );

      await session.commitTransaction();

      // send out otp
      await this.otpService.createOtp({
        userId: updatedUser?._id.toString() as string,
      });
      return new ReturnType({
        statusCode: 200,
        message: '',
        data: {
          user: {
            id: updatedUser!._id,
            email: updatedUser!.email,
            role: updatedUser!.role,
            companyId: updatedUser!.companyId,
          },
          company: {
            id: createdCompany._id,
            name: createdCompany.name,
            industry: createdCompany.industry,
            slug: createdCompany.slug,
            logo: createdCompany.logo,
            creatorId: createdCompany.creatorId,
          },
        },
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async resendOtp({ userId }: { userId: string }) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.otpService.createOtp({ userId: user._id.toString() });

    return new ReturnType({
      message: 'OTP resent to email',
      statusCode: 200,
      data: null,
    });
  }
}
