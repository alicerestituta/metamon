import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'Riwayat masuk & audit log' })
  @Get('me/audit-logs')
  getAuditLogs(@Req() req) {
    return this.officersService.getAuditLogs(req.user.sub);
  }
}
