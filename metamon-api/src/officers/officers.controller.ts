import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OfficersService } from './officers.service';
import { UpdateOfficerDto } from './dto/update-officer.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Officers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('officers')
export class OfficersController {
  constructor(private readonly officersService: OfficersService) {}

  // ── Self-service endpoints (existing mobile app) ─────────────────────────────

  @ApiOperation({ summary: 'Profil lengkap petugas yang sedang login' })
  @Get('me')
  getMe(@Req() req) {
    return this.officersService.findOne(req.user.sub);
  }

  @ApiOperation({ summary: 'Update profil petugas' })
  @Patch('me')
  updateMe(@Req() req, @Body() dto: UpdateOfficerDto) {
    return this.officersService.update(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Update preferensi notifikasi' })
  @Patch('me/notifications')
  updateNotifications(@Req() req, @Body() dto: UpdateNotificationsDto) {
    return this.officersService.updateNotifications(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Ganti kata sandi dan/atau PIN' })
  @Patch('me/password')
  updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.officersService.updatePassword(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Riwayat masuk & audit log petugas yang login' })
  @Get('me/audit-logs')
  getMyAuditLogs(@Req() req) {
    return this.officersService.getAuditLogs(req.user.sub);
  }

  // ── Admin endpoints (used by admin panel) ────────────────────────────────────

  @ApiOperation({ summary: '[Admin] Daftar semua petugas' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.officersService.findAll({ search, page: Number(page) || 1, limit: Number(limit) || 20 });
  }

  @ApiOperation({ summary: '[Admin] Buat petugas baru' })
  @Post()
  createOfficer(
    @Body()
    dto: {
      name: string;
      credentials: string;
      nip: string;
      role: string;
      avatarUrl?: string;
      password: string;
    },
  ) {
    return this.officersService.createOfficer(dto);
  }

  @ApiOperation({ summary: '[Admin] Detail satu petugas' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officersService.findOne(id);
  }

  @ApiOperation({ summary: '[Admin] Update data petugas (tanpa verifikasi password lama)' })
  @Patch(':id')
  adminUpdate(
    @Param('id') id: string,
    @Body()
    dto: Partial<{
      name: string;
      credentials: string;
      nip: string;
      role: string;
      avatarUrl: string;
      password: string;
    }>,
  ) {
    return this.officersService.adminUpdateOfficer(id, dto);
  }

  @ApiOperation({ summary: '[Admin] Hapus petugas' })
  @Delete(':id')
  deleteOfficer(@Param('id') id: string) {
    return this.officersService.deleteOfficer(id);
  }

  @ApiOperation({ summary: '[Admin] Semua audit log login (semua petugas)' })
  @Get('admin/audit-logs')
  getAllAuditLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.officersService.getAllAuditLogs({ page: Number(page) || 1, limit: Number(limit) || 20 });
  }
}
