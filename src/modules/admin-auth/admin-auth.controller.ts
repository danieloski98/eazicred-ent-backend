import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminValidateOtpDto } from './dto/validate-otp.dto';
import { AdminJwtAuthGuard } from '@/common/guards/admin-jwt.guard';
import { CurrentAdmin } from '@/common/decorators/current-admin.decorator';

@ApiTags('admin-auth')
@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new admin' })
  register(@Body() dto: CreateAdminDto) {
    return this.adminAuthService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login admin and send OTP' })
  login(@Body() dto: LoginAdminDto) {
    return this.adminAuthService.login(dto);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate admin OTP' })
  validateOtp(@Body() dto: AdminValidateOtpDto) {
    return this.adminAuthService.validateOtp(dto);
  }

  @Get('me')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get logged-in admin profile' })
  me(@CurrentAdmin() admin: { adminId: string }) {
    return this.adminAuthService.getProfile(admin.adminId);
  }
}
