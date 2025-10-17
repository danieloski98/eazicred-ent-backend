import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ID of the user to resend OTP for',
  })
  @IsString()
  userId: string;
}