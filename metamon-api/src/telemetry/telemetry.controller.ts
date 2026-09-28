import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TelemetryService } from './telemetry.service';

@ApiTags('Telemetry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @ApiOperation({ summary: 'Agregat data dashboard: risk level, CH4, sensor, armada' })
  @Get('dashboard')
  getDashboard() {
    return this.telemetryService.getDashboard();
  }
}
