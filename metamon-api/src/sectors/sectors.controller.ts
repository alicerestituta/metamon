import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SectorsService } from './sectors.service';
import { UpdateSectorDto } from './dto/update-sector.dto';

@ApiTags('Sectors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @ApiOperation({ summary: 'Semua sektor dengan status & CH4 terkini' })
  @Get()
  findAll() {
    return this.sectorsService.findAll();
  }

  @ApiOperation({ summary: 'Detail satu sektor' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectorsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update status/kapasitas sektor' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSectorDto) {
    return this.sectorsService.update(id, dto);
  }
}
