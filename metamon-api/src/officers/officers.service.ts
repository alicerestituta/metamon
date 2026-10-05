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
        accessLevel: officer.accessLevel,
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

  async createAuditLog(
    officerId: string,
    meta: { deviceName: string; ipAddress: string; locationNote?: string },
  ) {
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

  // ── Admin Methods ────────────────────────────────────────────────────────────

  async findAll(query?: { search?: string; page?: number; limit?: number }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.officerRepo.createQueryBuilder('o');
    if (query?.search) {
      qb.where('o.name ILIKE :search OR o.nip ILIKE :search OR o.role ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const [officers, total] = await qb
      .orderBy('o.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Get last login per officer from audit logs
    const officerIds = officers.map((o) => o.id);
    const lastLoginMap: Record<string, Date | null> = {};
    if (officerIds.length > 0) {
      const logs = await this.auditRepo
        .createQueryBuilder('a')
        .select('a.officer_id', 'officerId')
        .addSelect('MAX(a.created_at)', 'lastLogin')
        .where('a.officer_id IN (:...ids)', { ids: officerIds })
        .groupBy('a.officer_id')
        .getRawMany();
      logs.forEach((l) => {
        lastLoginMap[l.officerId] = l.lastLogin;
      });
    }

    return {
      success: true,
      data: {
        officers: officers.map((o) => ({
          id: o.id,
          name: o.name,
          credentials: o.credentials,
          nip: o.nip,
          role: o.role,
          avatarUrl: o.avatarUrl,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          lastLoginAt: lastLoginMap[o.id] ?? null,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async createOfficer(dto: {
    name: string;
    credentials: string;
    nip: string;
    role: string;
    avatarUrl?: string;
    password: string;
  }) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const officer = this.officerRepo.create({
      name: dto.name,
      credentials: dto.credentials,
      nip: dto.nip,
      role: dto.role,
      avatarUrl: dto.avatarUrl ?? '/officer_default.jpg',
      passwordHash,
    });
    await this.officerRepo.save(officer);
    return {
      success: true,
      data: {
        id: officer.id,
        name: officer.name,
        nip: officer.nip,
        role: officer.role,
        createdAt: officer.createdAt,
      },
      message: 'Petugas berhasil dibuat',
    };
  }

  async adminUpdateOfficer(
    id: string,
    dto: Partial<{
      name: string;
      credentials: string;
      nip: string;
      role: string;
      avatarUrl: string;
      password: string;
    }>,
  ) {
    const officer = await this.officerRepo.findOne({ where: { id } });
    if (!officer) throw new NotFoundException('Petugas tidak ditemukan');

    const updates: Partial<Officer> = {};
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.credentials !== undefined) updates.credentials = dto.credentials;
    if (dto.nip !== undefined) updates.nip = dto.nip;
    if (dto.role !== undefined) updates.role = dto.role;
    if (dto.avatarUrl !== undefined) updates.avatarUrl = dto.avatarUrl;
    if (dto.password) {
      updates.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    await this.officerRepo.update(id, updates);
    return { success: true, message: 'Data petugas berhasil diperbarui' };
  }

  async deleteOfficer(id: string) {
    const officer = await this.officerRepo.findOne({ where: { id } });
    if (!officer) throw new NotFoundException('Petugas tidak ditemukan');
    await this.officerRepo.delete(id);
    return { success: true, message: 'Petugas berhasil dihapus' };
  }

  async getAllAuditLogs(query?: { page?: number; limit?: number }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;
    const [logs, total] = await this.auditRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.officer', 'o')
      .orderBy('a.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: {
        logs: logs.map((l) => ({
          id: l.id,
          officer: l.officer
            ? { id: l.officer.id, name: l.officer.name, nip: l.officer.nip }
            : null,
          deviceName: l.deviceName,
          ipAddress: l.ipAddress,
          locationNote: l.locationNote,
          isActiveSession: l.isActiveSession,
          createdAt: l.createdAt,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    };
  }
}
