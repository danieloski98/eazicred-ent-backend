import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty({ required: false, example: 'Tech Corp Ltd' })
  @IsString()
  @IsOptional()
  name?: string;
}
