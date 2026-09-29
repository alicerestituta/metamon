import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SopTask } from './entities/sop-task.entity';
import { IncidentLog } from './entities/incident-log.entity';
import { Sector } from '../sectors/entities/sector.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { AlertBroadcastDto } from './dto/alert-broadcast.dto';
import { IncidentQueryDto } from './dto/incident-query.dto';

@Injectable()
export class SopService {
  constructor(
    @InjectRepository(SopTask) private readonly taskRepo: Repository<SopTask>,
    @InjectRepository(IncidentLog) private readonly incidentRepo: Repository<IncidentLog>,
    @InjectRepository(Sector) private readonly sectorRepo: Repository<Sector>,
  ) {}

  async getTasks() {
    const tasks = await this.taskRepo.find({ order: { orderIndex: 'ASC' } });
    const completedCount = tasks.filter((t) => t.isCompleted).length;
    return {
      success: true,
      data: {
        tasks: tasks.map((t) => ({
          id: t.id,
          title: t.title,
          isCompleted: t.isCompleted,
          completedAt: t.completedAt,
          orderIndex: t.orderIndex,
        })),
        completedCount,
        totalCount: tasks.length,
      },
    };
  }

  async toggleTask(id: string) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task tidak ditemukan');

    const isCompleted = !task.isCompleted;
    await this.taskRepo.update(id, {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });
    const updated = await this.taskRepo.findOne({ where: { id } });
    return {
      success: true,
      data: { id, isCompleted: updated.isCompleted, completedAt: updated.completedAt },
    };
  }

  async getIncidents(query: IncidentQueryDto) {
    const qb = this.incidentRepo.createQueryBuilder('i').leftJoinAndSelect('i.sector', 's');

    if (query.status && query.status !== 'all')
      qb.andWhere('i.status = :status', { status: query.status });
    else if (!query.status) qb.andWhere('i.status = :status', { status: 'resolved' });

    if (query.sectorCode) qb.andWhere('s.sector_code = :code', { code: query.sectorCode });

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [incidents, total] = await qb
      .orderBy('i.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: {
        incidents: incidents.map((i) => ({
          id: i.id,
          title: i.title,
          description: i.description,
          mitigationNotes: i.mitigationNotes,
          sector: i.sector
            ? { id: i.sector.id, sectorCode: i.sector.sectorCode, name: i.sector.name }
            : null,
          status: i.status,
          resolvedAt: i.resolvedAt,
          createdAt: i.createdAt,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async createIncident(dto: CreateIncidentDto) {
    let sectorId: string | null = null;
    if (dto.sectorCode) {
      const sector = await this.sectorRepo.findOne({ where: { sectorCode: dto.sectorCode } });
      sectorId = sector?.id ?? null;
    }
    const incident = this.incidentRepo.create({ ...dto, sectorId });
    await this.incidentRepo.save(incident);
    return { success: true, data: incident };
  }

  async updateIncident(id: string, dto: UpdateIncidentDto) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Insiden tidak ditemukan');

    const updates: Partial<IncidentLog> = { ...dto } as any;
    if (dto.status === 'resolved' && !incident.resolvedAt) {
      updates.resolvedAt = new Date();
    }
    await this.incidentRepo.update(id, updates);
    return { success: true, message: 'Log insiden diperbarui' };
  }

  async alertBroadcast(dto: AlertBroadcastDto) {
    // Phase 1: log ke DB. Phase 2: integrasi push notification / FCM
    const incident = this.incidentRepo.create({
      title: 'Alert Broadcast Dikirim',
      description: dto.message,
      status: 'open',
    });
    if (dto.sectorCode) {
      const sector = await this.sectorRepo.findOne({ where: { sectorCode: dto.sectorCode } });
      if (sector) incident.sectorId = sector.id;
    }
    await this.incidentRepo.save(incident);
    return {
      success: true,
      message:
        'Peringatan Dini (Alert Broadcast) telah dikirimkan ke Tim Operasional TPA & Damkar.',
    };
  }
}
