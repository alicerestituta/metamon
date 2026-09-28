import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrucksService } from './trucks.service';
import { TruckQueryDto } from './dto/truck-query.dto';
import { RerouteBulkDto } from './dto/reroute-bulk.dto';
import { RerouteSingleDto } from './dto/reroute-single.dto';

@ApiTags('Trucks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @ApiOperation({ summary: 'Daftar armada truk dengan status pengalihan' })
  @Get()
  findAll(@Query() query: TruckQueryDto) {
    return this.trucksService.findAll(query);
  }

  @ApiOperation({ summary: 'Eksekusi pengalihan kuota bulk truk antar sektor' })
  @Patch('reroute-bulk')
  rerouteBulk(@Body() dto: RerouteBulkDto) {
    return this.trucksService.rerouteBulk(dto);
  }

  @ApiOperation({ summary: 'Ubah pengalihan satu truk' })
  @Patch(':id/reroute')
  rerouteSingle(@Param('id') id: string, @Body() dto: RerouteSingleDto) {
    return this.trucksService.rerouteSingle(id, dto);
  }
}
