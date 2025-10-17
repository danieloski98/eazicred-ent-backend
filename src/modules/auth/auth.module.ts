import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../../modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Company, CompanySchema } from '../companies/schemas/company.schema';
import { OtpService } from '@/common/services/otp/otp.service';
import { Otp, OtpSchema } from '@/database/schemas/otp.schema';
import { EmailService } from '@/common/services/email/email.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
