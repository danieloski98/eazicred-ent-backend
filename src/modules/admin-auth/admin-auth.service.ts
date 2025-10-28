import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { ReturnType } from '@common/classes/ReturnType';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { EmailService } from '@/common/services/email/email.service';
import { Otp } from '@/database/schemas/otp.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthService {
  private logger = new Logger(AdminAuthService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  private generateOtpCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
    return otp;
  }

  async register(dto: CreateAdminDto) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.adminModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('Admin with this email already exists');
    }

    const admin = new this.adminModel({
      name: dto.name,
      email,
    });
    await admin.save();

    // Generate and persist OTP for admin, then send email
    const code = this.generateOtpCode();
    const data = await this.otpModel.create({
      code,
      userId: admin._id.toString(),
    });
    await data.save();

    await this.emailService.sendConfirmationMail({
      email: admin.email,
      code,
      name: admin.name ?? admin.email,
    });

    return new ReturnType({
      message: 'Admin created successfully',
      statusCode: 201,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  }

  async login(dto: LoginAdminDto) {
    const email = dto.email.toLowerCase().trim();
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Generate and persist OTP for admin, then send email
    const code = this.generateOtpCode();
    const data = await this.otpModel.create({
      code,
      userId: admin._id.toString(),
    });
    await data.save();

    await this.emailService.sendConfirmationMail({
      email: admin.email,
      code,
      name: admin.name ?? admin.email,
    });

    return new ReturnType({
      message: 'OTP sent to email',
      statusCode: 200,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  }

  /**
   * Validate admin email and send an OTP to it.
   * This is a dedicated flow for sending OTP without implying login semantics.
   */
  async requestOtp(dto: LoginAdminDto) {
    const email = dto.email.toLowerCase().trim();
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const code = this.generateOtpCode();
    const record = await this.otpModel.create({
      code,
      userId: admin._id.toString(),
    });
    await record.save();

    await this.emailService.sendConfirmationMail({
      email: admin.email,
      code,
      name: admin.name ?? admin.email,
    });

    return new ReturnType({
      message: 'OTP sent to email',
      statusCode: 200,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  }

  async validateOtp({ adminId, otp }: { adminId: string; otp: string }) {
    try {
      const admin = await this.adminModel.findById(adminId);
      if (!admin) {
        throw new UnauthorizedException('Invalid admin credentials');
      }

      const record = await this.otpModel
        .findOne({ code: otp, userId: adminId })
        .sort({ createdAt: -1 })
        .exec();

      if (!record) {
        throw new BadRequestException('Invalid OTP code');
      }
      // mark as used
      record.expired = true;
      await record.save();

      const payload = { email: admin.email, sub: admin._id };
      const access_token = this.jwtService.sign(payload);

      return new ReturnType({
        message: 'OTP verified successfully',
        statusCode: 200,
        data: {
          access_token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Unable to verify OTP');
    }
  }

  async getProfile(adminId: string) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return new ReturnType({
      message: 'Admin profile fetched',
      statusCode: 200,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  }
}
