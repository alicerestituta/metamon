import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorNode } from './entities/sensor-node.entity';
import { SensorReading } from '../readings/entities/sensor-reading.entity';
import { SensorQueryDto } from './dto/sensor-query.dto';

const getCh4Status = (ppm: number) => {
  if (ppm >= 1000) return 'danger';
  if (ppm >= 500) return 'warning';
  return 'normal';
};

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(SensorNode) private readonly nodeRepo: Repository<SensorNode>,
    @InjectRepository(SensorReading) private readonly readingRepo: Repository<SensorReading>,
  ) {}

  async findAll(query: SensorQueryDto) {
    const qb = this.nodeRepo.createQueryBuilder('n').leftJoinAndSelect('n.sector', 's');

    if (query.sector) qb.andWhere('s.sector_code = :sector', { sector: query.sector });
    if (query.search) qb.andWhere('n.node_code ILIKE :search', { search: `%${query.search}%` });

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    qb.skip((page - 1) * limit).take(limit);

    const [nodes, total] = await qb.getManyAndCount();

    const enrichedNodes = await Promise.all(
      nodes.map(async (node) => {
        const latest = await this.readingRepo.findOne({
          where: { nodeId: node.id },
          order: { recordedAt: 'DESC' },
        });
        const ch4 = latest ? parseFloat(latest.ch4Ppm as any) : 0;
        const status = getCh4Status(ch4);
        return {
          id: node.id,
          nodeCode: node.nodeCode,
          sector: {
            id: node.sector.id,
            sectorCode: node.sector.sectorCode,
            name: node.sector.name,
          },
          batteryPercent: node.batteryPercent,
          isActive: node.isActive,
          lastSeenAt: node.lastSeenAt,
          latestReading: latest ? { ch4Ppm: ch4, recordedAt: latest.recordedAt } : null,
          status,
        };
      }),
    );

    // Filter by status setelah enrich (status dihitung dinamis)
    const filtered = query.status
      ? enrichedNodes.filter((n) => n.status === query.status)
      : enrichedNodes;

    // Summary
    const allNodes = await this.nodeRepo.find();
    const activeNodes = allNodes.filter((n) => n.isActive).length;
    const peakReading = await this.readingRepo
      .createQueryBuilder('r')
      .innerJoin('r.node', 'n')
      .where('n.is_active = true')
      .orderBy('r.ch4_ppm', 'DESC')
      .leftJoinAndSelect('r.node', 'node')
      .leftJoinAndSelect('node.sector', 'sec')
      .getOne();

    return {
      success: true,
      data: {
        nodes: filtered,
        summary: {
          totalNodes: allNodes.length,
          activeNodes,
          peakCh4Ppm: peakReading ? parseFloat(peakReading.ch4Ppm as any) : null,
          peakNodeCode: peakReading?.node?.nodeCode ?? null,
          peakSectorName: peakReading?.node?.sector?.name ?? null,
        },
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async findOne(id: string) {
    const node = await this.nodeRepo.findOne({ where: { id }, relations: ['sector'] });
    if (!node) throw new NotFoundException('Node sensor tidak ditemukan');
    return { success: true, data: node };
  }

  async getReadings(nodeId: string, from?: string, to?: string, limit = 100) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 86400000);
    const toDate = to ? new Date(to) : new Date();
    const readings = await this.readingRepo
      .createQueryBuilder('r')
      .where('r.node_id = :nodeId', { nodeId })
      .andWhere('r.recorded_at BETWEEN :from AND :to', { from: fromDate, to: toDate })
      .orderBy('r.recorded_at', 'DESC')
      .take(+limit)
      .getMany();
    return { success: true, data: readings };
  }
}
