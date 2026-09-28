import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SopService } from './sop.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { AlertBroadcastDto } from './dto/alert-broadcast.dto';
import { IncidentQueryDto } from './dto/incident-query.dto';

@ApiTags('SOP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sop')
export class SopController {
  constructor(private readonly sopService: SopService) {}

  @ApiOperation({ summary: 'Daftar checklist tugas tanggap darurat' })
  @Get('tasks')
  getTasks() {
    return this.sopService.getTasks();
  }

  @ApiOperation({ summary: 'Toggle selesai/belum pada satu tugas' })
  @Patch('tasks/:id/toggle')
  toggleTask(@Param('id') id: string) {
    return this.sopService.toggleTask(id);
  }

  @ApiOperation({ summary: 'Riwayat insiden K3 TPA' })
  @Get('incidents')
  getIncidents(@Query() query: IncidentQueryDto) {
    return this.sopService.getIncidents(query);
  }

  @ApiOperation({ summary: 'Buat log insiden baru' })
  @Post('incidents')
  createIncident(@Body() dto: CreateIncidentDto) {
    return this.sopService.createIncident(dto);
  }

  @ApiOperation({ summary: 'Update catatan penanganan / status insiden' })
  @Patch('incidents/:id')
  updateIncident(@Param('id') id: string, @Body() dto: UpdateIncidentDto) {
    return this.sopService.updateIncident(id, dto);
  }

  @ApiOperation({ summary: 'Kirim broadcast peringatan dini' })
  @Post('alert-broadcast')
  alertBroadcast(@Body() dto: AlertBroadcastDto) {
    return this.sopService.alertBroadcast(dto);
  }
}
