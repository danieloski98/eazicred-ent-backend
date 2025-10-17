import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '../../../common/decorators/roles.decorator';

export class RegisterUserPayloadDto {
  @ApiProperty({ example: 'hr.manager@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'clatus', minLength: 6 })
  @IsString()
  @MinLength(6)
  fullname: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.HR,
    description: 'Role for the new user',
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateCompanyPayloadDto {
  @ApiProperty({ example: 'Tech Corp Ltd', description: 'Company legal name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Fintech',
    description: 'Industry or sector of the company',
  })
  @IsString()
  industry: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dxue9s2by/image/upload/v1760667994/uploader/file_dzhkh8.svg',
    description: 'Public URL to the company logo',
  })
  @IsUrl()
  logo: string;
}

export class RegisterCompanyAndUserDto {
  @ApiProperty({ type: () => RegisterUserPayloadDto })
  @ValidateNested()
  @Type(() => RegisterUserPayloadDto)
  user: RegisterUserPayloadDto;

  @ApiProperty({ type: () => CreateCompanyPayloadDto })
  @ValidateNested()
  @Type(() => CreateCompanyPayloadDto)
  company: CreateCompanyPayloadDto;
}
