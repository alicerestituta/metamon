import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from './entities/sector.entity';
import { SensorReading } from '../readings/entities/sensor-reading.entity';
import { SensorNode } from '../sensors/entities/sensor-node.entity';
import { UpdateSectorDto } from './dto/update-sector.dto';

const STATUS_LABEL = {
  normal: 'Beban Normal',
  warning: 'Beban Sedang',
  danger: 'Beban Penuh',
  locked: 'Beban Penuh',
};

@Injectable()
export class SectorsService {
  constructor(
    @InjectRepository(Sector) private readonly sectorRepo: Repository<Sector>,
    @InjectRepository(SensorReading) private readonly readingRepo: Repository<SensorReading>,
    @InjectRepository(SensorNode) private readonly nodeRepo: Repository<SensorNode>,
  ) {}

  async findAll() {
    const sectors = await this.sectorRepo.find({ order: { sectorCode: 'ASC' } });
    const enriched = await Promise.all(sectors.map((s) => this.enrichSector(s)));
    return { success: true, data: enriched };
  }

  async findOne(id: string) {
    const sector = await this.sectorRepo.findOne({ where: { id } });
    if (!sector) throw new NotFoundException('Sektor tidak ditemukan');
    return { success: true, data: await this.enrichSector(sector) };
  }

  async update(id: string, dto: UpdateSectorDto) {
    await this.sectorRepo.update(id, dto as any);
    return this.findOne(id);
  }

  // Ambil CH4 rata-rata dari node aktif di sektor ini dalam 30 detik terakhir
  private async getCurrentCh4(sectorId: string): Promise<number | null> {
    const result = await this.readingRepo
      .createQueryBuilder('r')
      .innerJoin('r.node', 'n')
      .where('n.sector_id = :sectorId', { sectorId })
      .andWhere('n.is_active = true')
      .andWhere("r.recorded_at >= NOW() - INTERVAL '30 seconds'")
      .select('AVG(r.ch4_ppm)', 'avgCh4')
      .getRawOne();
    return result?.avgCh4 ? Math.round(parseFloat(result.avgCh4)) : null;
  }

  private async enrichSector(sector: Sector) {
    const currentCh4Ppm = await this.getCurrentCh4(sector.id);
    
    let dynamicStatus = sector.status;
    // Jika tidak dikunci manual, update status sesuai nilai CH4 terkini
    if (dynamicStatus !== 'locked' && currentCh4Ppm !== null) {
      dynamicStatus = currentCh4Ppm >= 1000 ? 'danger' : (currentCh4Ppm >= 500 ? 'warning' : 'normal');
    }

    return {
      id: sector.id,
      sectorCode: sector.sectorCode,
      name: sector.name,
      capacityPercent: sector.capacityPercent,
      status: dynamicStatus,
      statusLabel: STATUS_LABEL[dynamicStatus] ?? dynamicStatus,
      isAcceptingTrucks: sector.isAcceptingTrucks,
      currentCh4Ppm,
      updatedAt: sector.updatedAt,
    };
  }
}
