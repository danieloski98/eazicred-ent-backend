import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { EmailService } from '@/common/services/email/email.service';
import { Otp, OtpSchema } from '@/database/schemas/otp.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminJwtStrategy } from './admin-jwt.strategy';

@Module({
  imports: [
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
      { name: Admin.name, schema: AdminSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, EmailService, AdminJwtStrategy],
})
export class AdminAuthModule {}
