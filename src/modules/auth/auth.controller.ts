import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterCompanyAndUserDto } from './dto/register-company-user.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from '../../modules/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Initiate login, send OTP to email' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP and issue JWT' })
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.authService.validateOtp(dto);
  }

  @Post('register-company-user')
  @ApiOperation({ summary: 'Register company and user atomically' })
  async registerCompanyAndUser(@Body() dto: RegisterCompanyAndUserDto) {
    return this.authService.registerCompanyAndUser(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    const userProfile = await this.usersService.findById(user.userId);
    if (!userProfile) {
      throw new Error('User not found');
    }
    const { password, ...result } = userProfile.toObject();
    return result;
  }
}
