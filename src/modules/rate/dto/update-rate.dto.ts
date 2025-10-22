import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateRateDto {
  @ApiProperty({ example: 5.5, description: 'Current rate value' })
  @IsNumber()
  rate: number;
}