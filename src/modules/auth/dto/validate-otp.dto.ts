import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateOtpDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ID of the user to validate',
  })
  @IsString()
  userId: string;

  @ApiProperty({ example: '123456', description: 'OTP code sent to email' })
  @IsString()
  otp: string;
}