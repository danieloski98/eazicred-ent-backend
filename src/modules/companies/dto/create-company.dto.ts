import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Corp Ltd' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
