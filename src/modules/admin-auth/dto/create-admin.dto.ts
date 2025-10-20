import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin User' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}