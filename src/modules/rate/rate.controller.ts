import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RateService } from './rate.service';
import { UpdateRateDto } from './dto/update-rate.dto';

@ApiTags('Rate')
@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current rate' })
  async getRate() {
    return this.rateService.getRate();
  }

  @Patch()
  @ApiOperation({ summary: 'Update the rate (singleton)' })
  async updateRate(@Body() dto: UpdateRateDto) {
    return this.rateService.updateRate(dto.rate);
  }
}
