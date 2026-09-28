import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SensorsService } from './sensors.service';
import { SensorQueryDto } from './dto/sensor-query.dto';

@ApiTags('Sensors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @ApiOperation({ summary: 'Daftar node sensor + pembacaan terbaru + summary' })
  @Get()
  findAll(@Query() query: SensorQueryDto) {
    return this.sensorsService.findAll(query);
  }

  @ApiOperation({ summary: 'Detail satu node sensor' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorsService.findOne(id);
  }

  @ApiOperation({ summary: 'Riwayat pembacaan satu node' })
  @Get(':id/readings')
  getReadings(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: number,
  ) {
    return this.sensorsService.getReadings(id, from, to, limit);
  }
}
