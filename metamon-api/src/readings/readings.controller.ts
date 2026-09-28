import { Controller, Post, Get, Body, Query, UseGuards, Headers, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReadingsService } from './readings.service';
import { CreateReadingDto } from './dto/create-reading.dto';

@ApiTags('Readings')
@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @ApiOperation({ summary: 'Terima pembacaan dari node sensor (pakai X-Sensor-Key)' })
  @ApiHeader({ name: 'X-Sensor-Key', description: 'API key dari node sensor' })
  @Post()
  create(@Body() dto: CreateReadingDto, @Headers('x-sensor-key') apiKey: string) {
    return this.readingsService.create(dto, apiKey);
  }

  @ApiOperation({ summary: 'Time-series CH4 hari ini untuk chart MethaneChart' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('ch4-series')
  getCh4Series(@Query('sectorCode') sectorCode?: string, @Query('date') date?: string) {
    return this.readingsService.getCh4Series(sectorCode, date);
  }

  @ApiOperation({ summary: 'Simulasi pembacaan sensor realtime (tanpa sensor asli)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('simulate')
  simulate() {
    return this.readingsService.simulateReading();
  }

  @ApiOperation({ summary: 'Isi data historis dummy hari ini ke DB (untuk chart)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('seed-history')
  seedHistory() {
    return this.readingsService.seedTodayHistory();
  }
}
