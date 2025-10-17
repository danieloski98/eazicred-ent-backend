import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';
import { User } from '@/modules/users/schemas/user.schema';
import { ReturnType } from '@common/classes/ReturnType';
import { Otp } from '@/database/schemas/otp.schema';

@Injectable()
export class OtpService {
  private logger = new Logger(OtpService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    private emailService: EmailService,
  ) {}

  private generateOtpCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
    console.log('otp =>', otp);

    return otp;
  }

  async createOtp({ userId }: { userId?: string }) {
    try {
      if (!userId) throw new NotFoundException('User not found!');
      const user = await this.userModel.findById(userId);
      if (!user || user === undefined) {
        throw new NotFoundException('User not found!');
      }
      // generate OTP code
      const otp = this.generateOtpCode();
      // save the OTP
      const data = await this.otpModel.create({
        code: otp,
        userId,
      });
      await data.save();
      // send out emailService
      await this.emailService.sendConfirmationMail({
        code: otp,
        email: user?.email,
        name: user.email,
      });

      this.logger.debug('OTP SENT OUT!!!');

      return new ReturnType({
        message: 'OTP SENT',
        statusCode: 200,
        data: null,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async verifyOtp({ code }: { code: string }) {
    try {
      // Find the most recent OTP for this user
      const otp = await this.otpModel
        .findOne({
          code,
        })
        .sort({ createdAt: -1 });
      this.logger.debug('OTP', otp);

      if (!otp || otp.expired) {
        throw new BadRequestException('Invalid OTP code');
      }

      // Check if OTP has expired (15 minutes)
      const otpCreatedTime = new Date(otp.createdAt).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - otpCreatedTime) / (1000 * 60); // Convert to minutes

      // if (timeDiff > 100 || otp.isExpired) {
      //     await this.otpModel.updateOne({
      //         _id: otp._id,
      //     }, {
      //         isExpired: true
      //     })
      //     throw new BadRequestException('OTP has expired');
      // }

      if (otp.expired) {
        await this.otpModel.updateOne(
          {
            _id: otp._id,
          },
          {
            isExpired: true,
          },
        );
        throw new BadRequestException('OTP has expired');
      }

      // If OTP is valid, mark it as used
      otp.expired = true;
      await otp.save();

      return new ReturnType({
        message: 'OTP verified successfully',
        statusCode: 200,
        data: {
          user: otp.userId,
          otp,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
