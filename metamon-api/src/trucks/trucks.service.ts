import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './entities/truck.entity';
import { Sector } from '../sectors/entities/sector.entity';
import { TruckQueryDto } from './dto/truck-query.dto';
import { RerouteBulkDto } from './dto/reroute-bulk.dto';
import { RerouteSingleDto } from './dto/reroute-single.dto';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck) private readonly truckRepo: Repository<Truck>,
    @InjectRepository(Sector) private readonly sectorRepo: Repository<Sector>,
  ) {}

  async findAll(query: TruckQueryDto) {
    const qb = this.truckRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.originalSector', 'os')
      .leftJoinAndSelect('t.reroutedSector', 'rs');

    if (query.status === 'rerouted') qb.andWhere('t.is_rerouted = true');
    if (query.status === 'normal') qb.andWhere('t.is_rerouted = false');
    if (query.search) qb.andWhere('t.plate_number ILIKE :s', { s: `%${query.search}%` });

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [trucks, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const reroutedCount = await this.truckRepo.count({ where: { isRerouted: true } });
    const normalCount = await this.truckRepo.count({ where: { isRerouted: false } });

    return {
      success: true,
      data: {
        trucks: trucks.map((t) => ({
          id: t.id,
          plateNumber: t.plateNumber,
          isRerouted: t.isRerouted,
          originalSector: t.originalSector
            ? {
                id: t.originalSector.id,
                sectorCode: t.originalSector.sectorCode,
                name: t.originalSector.name,
              }
            : null,
          reroutedSector: t.reroutedSector
            ? {
                id: t.reroutedSector.id,
                sectorCode: t.reroutedSector.sectorCode,
                name: t.reroutedSector.name,
              }
            : null,
        })),
        summary: { total, reroutedCount, normalCount },
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async rerouteBulk(dto: RerouteBulkDto) {
    const toSector = await this.sectorRepo.findOne({ where: { sectorCode: dto.toSectorCode } });
    if (!toSector) throw new NotFoundException('Sektor tujuan tidak ditemukan');

    const fromSector = await this.sectorRepo.findOne({ where: { sectorCode: dto.fromSectorCode } });
    if (!fromSector) throw new NotFoundException('Sektor asal tidak ditemukan');

    const trucks = await this.truckRepo.find({ where: { originalSectorId: fromSector.id } });
    await Promise.all(
      trucks.map((t) =>
        this.truckRepo.update(t.id, { isRerouted: true, reroutedSectorId: toSector.id }),
      ),
    );

    return {
      success: true,
      data: {
        reroutedCount: trucks.length,
        message: `Pengalihan Kuota Truk Berhasil Dieksekusi ke ${toSector.name}`,
      },
    };
  }

  async rerouteSingle(id: string, dto: RerouteSingleDto) {
    const truck = await this.truckRepo.findOne({ where: { id } });
    if (!truck) throw new NotFoundException('Truk tidak ditemukan');

    const toSector = await this.sectorRepo.findOne({ where: { sectorCode: dto.toSectorCode } });
    if (!toSector) throw new NotFoundException('Sektor tujuan tidak ditemukan');

    await this.truckRepo.update(id, { isRerouted: true, reroutedSectorId: toSector.id });
    return { success: true, message: `Rute armada berhasil dipindahkan ke ${toSector.name}` };
  }
}
