import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../sectors/entities/sector.entity';
import { SensorNode } from '../sensors/entities/sensor-node.entity';
import { SensorReading } from '../readings/entities/sensor-reading.entity';
import { Truck } from '../trucks/entities/truck.entity';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(Sector) private readonly sectorRepo: Repository<Sector>,
    @InjectRepository(SensorNode) private readonly nodeRepo: Repository<SensorNode>,
    @InjectRepository(SensorReading) private readonly readingRepo: Repository<SensorReading>,
    @InjectRepository(Truck) private readonly truckRepo: Repository<Truck>,
  ) {}

  async getDashboard() {
    const sectors = await this.sectorRepo.find();
    const allNodes = await this.nodeRepo.find();
    const activeNodes = allNodes.filter((n) => n.isActive).length;
    const reroutedTrucks = await this.truckRepo.count({ where: { isRerouted: true } });

    // Status bahaya tertinggi
    let riskLevel = 'normal';
    let alertSector = null;
    let alertMessage = null;
    for (const s of sectors) {
      if (s.status === 'danger' || s.status === 'locked') {
        riskLevel = 'danger';
        alertSector = s.sectorCode;
        alertMessage = 'CH4 melampaui batas ambang';
        break;
      }
      if (s.status === 'warning') riskLevel = 'warning';
    }

    // Rata-rata CH4 terkini (semua node aktif, pembacaan terbaru per node)
    const avgResult = await this.readingRepo
      .createQueryBuilder('r')
      .innerJoin('r.node', 'n')
      .where('n.is_active = true')
      .andWhere(
        `r.recorded_at = (
          SELECT MAX(r2.recorded_at) FROM sensor_readings r2 WHERE r2.node_id = r.node_id
        )`,
      )
      .select('AVG(r.ch4_ppm)', 'avg')
      .getRawOne();

    // Tren CH4 vs 24 jam lalu
    const avg24hAgo = await this.readingRepo
      .createQueryBuilder('r')
      .innerJoin('r.node', 'n')
      .where('n.is_active = true')
      .andWhere('r.recorded_at BETWEEN :start AND :end', {
        start: new Date(Date.now() - 48 * 3600000),
        end: new Date(Date.now() - 24 * 3600000),
      })
      .select('AVG(r.ch4_ppm)', 'avg')
      .getRawOne();

    const avgNow = avgResult?.avg ? parseFloat(avgResult.avg) : 0;
    const avgPrev = avg24hAgo?.avg ? parseFloat(avg24hAgo.avg) : avgNow;
    const trendPct = avgPrev > 0 ? Math.round(((avgNow - avgPrev) / avgPrev) * 100) : 0;

    return {
      success: true,
      data: {
        riskLevel,
        alertSector,
        alertMessage,
        avgCh4Ppm: Math.round(avgNow),
        ch4TrendPercent24h: trendPct,
        activeNodes,
        totalNodes: allNodes.length,
        activeNodePercent: parseFloat(((activeNodes / allNodes.length) * 100).toFixed(1)),
        reroutedTrucks,
      },
    };
  }
}
