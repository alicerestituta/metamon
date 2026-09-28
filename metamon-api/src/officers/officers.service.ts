import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Officer } from './entities/officer.entity';
import { AuditLog } from './entities/audit-log.entity';
import { UpdateOfficerDto } from './dto/update-officer.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class OfficersService {
  constructor(
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async findByNip(nip: string): Promise<Officer | null> {
    return this.officerRepo.findOne({ where: { nip } });
  }

  async findOne(id: string) {
    const officer = await this.officerRepo.findOne({ where: { id } });
    if (!officer) throw new NotFoundException('Petugas tidak ditemukan');
    return {
      success: true,
      data: {
        id: officer.id,
        name: officer.name,
        credentials: officer.credentials,
        nip: officer.nip,
        role: officer.role,
        avatarUrl: officer.avatarUrl,
        notifications: {
          methaneAlert: officer.methaneAlertNotif,
          dailyReport: officer.dailyReportNotif,
        },
      },
    };
  }

  async update(id: string, dto: UpdateOfficerDto) {
    await this.officerRepo.update(id, dto);
    return this.findOne(id);
  }

  async updateNotifications(id: string, dto: UpdateNotificationsDto) {
    await this.officerRepo.update(id, {
      methaneAlertNotif: dto.methaneAlert,
      dailyReportNotif: dto.dailyReport,
    });
    return { success: true, message: 'Preferensi notifikasi diperbarui' };
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const officer = await this.officerRepo.findOne({ where: { id } });
    const isMatch = await bcrypt.compare(dto.currentPassword, officer.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Kata sandi saat ini salah');

    const updates: Partial<Officer> = {
      passwordHash: await bcrypt.hash(dto.newPassword, 12),
    };
    if (dto.newPin) {
      updates.pinHash = await bcrypt.hash(dto.newPin, 12);
    }
    await this.officerRepo.update(id, updates);
    return { success: true, message: 'Kata sandi dan PIN berhasil diperbarui' };
  }

  async createAuditLog(officerId: string, meta: { deviceName: string; ipAddress: string; locationNote?: string }) {
    const log = this.auditRepo.create({ officerId, isActiveSession: true, ...meta });
    return this.auditRepo.save(log);
  }

  async deactivateAuditLog(officerId: string) {
    await this.auditRepo.update({ officerId, isActiveSession: true }, { isActiveSession: false });
  }

  async getAuditLogs(officerId: string) {
    const logs = await this.auditRepo.find({
      where: { officerId },
      order: { createdAt: 'DESC' },
      take: 10,
    });
    return { success: true, data: logs };
  }
}
