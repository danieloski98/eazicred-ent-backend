import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminValidateOtpDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ID of the admin to validate',
  })
  @IsString()
  adminId: string;

  @ApiProperty({ example: 'ABC123', description: 'OTP code sent to admin email' })
  @IsString()
  otp: string;
}