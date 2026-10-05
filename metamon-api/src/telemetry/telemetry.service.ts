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

  async getAdminStats() {
    const [sectors, allNodes, allTrucks] = await Promise.all([
      this.sectorRepo.find(),
      this.nodeRepo.find(),
      this.truckRepo.find(),
    ]);

    const activeNodes = allNodes.filter((n) => n.isActive).length;
    const reroutedTrucks = allTrucks.filter((t) => t.isRerouted).length;
    const dangerSectors = sectors.filter(
      (s) => s.status === 'danger' || s.status === 'locked',
    ).length;
    const warningSectors = sectors.filter((s) => s.status === 'warning').length;

    // CH4 series harian (last 7 days — aggregate per day)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000);
    const dailySeries = await this.readingRepo
      .createQueryBuilder('r')
      .select("DATE_TRUNC('day', r.recorded_at)", 'day')
      .addSelect('AVG(r.ch4_ppm)', 'avg_ch4')
      .addSelect('MAX(r.ch4_ppm)', 'max_ch4')
      .where('r.recorded_at >= :start', { start: sevenDaysAgo })
      .groupBy("DATE_TRUNC('day', r.recorded_at)")
      .orderBy("DATE_TRUNC('day', r.recorded_at)", 'ASC')
      .getRawMany();

    // Sector status breakdown
    const sectorStatusBreakdown = sectors.map((s) => ({
      sectorCode: s.sectorCode,
      name: s.name,
      status: s.status,
      capacityPercent: s.capacityPercent,
      isAcceptingTrucks: s.isAcceptingTrucks,
    }));

    return {
      success: true,
      data: {
        overview: {
          totalSectors: sectors.length,
          dangerSectors,
          warningSectors,
          normalSectors: sectors.length - dangerSectors - warningSectors,
          totalNodes: allNodes.length,
          activeNodes,
          inactiveNodes: allNodes.length - activeNodes,
          totalTrucks: allTrucks.length,
          reroutedTrucks,
          normalTrucks: allTrucks.length - reroutedTrucks,
        },
        sectorStatusBreakdown,
        ch4DailySeries: dailySeries.map((d) => ({
          day: d.day,
          avgCh4: d.avg_ch4 ? parseFloat(d.avg_ch4).toFixed(1) : '0',
          maxCh4: d.max_ch4 ? parseFloat(d.max_ch4).toFixed(1) : '0',
        })),
      },
    };
  }
}
