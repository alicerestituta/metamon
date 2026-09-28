import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SensorReading } from './entities/sensor-reading.entity';
import { SensorNode } from '../sensors/entities/sensor-node.entity';
import { CreateReadingDto } from './dto/create-reading.dto';

@Injectable()
export class ReadingsService {
  constructor(
    @InjectRepository(SensorReading) private readonly readingRepo: Repository<SensorReading>,
    @InjectRepository(SensorNode) private readonly nodeRepo: Repository<SensorNode>,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateReadingDto, apiKey: string) {
    if (apiKey !== this.config.get('SENSOR_API_KEY')) {
      throw new UnauthorizedException('API key tidak valid');
    }
    const node = await this.nodeRepo.findOne({ where: { nodeCode: dto.nodeCode } });
    if (!node) throw new UnauthorizedException('Node tidak dikenal');

    const reading = this.readingRepo.create({
      nodeId: node.id,
      ch4Ppm: dto.ch4Ppm,
      temperatureCelsius: dto.temperatureCelsius,
      recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
    });
    await this.readingRepo.save(reading);
    await this.nodeRepo.update(node.id, { lastSeenAt: new Date() });
    return { success: true, message: 'Pembacaan berhasil disimpan' };
  }

  async getCh4Series(sectorCode?: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    const qb = this.readingRepo
      .createQueryBuilder('r')
      .innerJoin('r.node', 'n')
      .innerJoin('n.sector', 's')
      .where('r.recorded_at BETWEEN :start AND :end', { start, end })
      .andWhere('n.is_active = true');

    if (sectorCode) qb.andWhere('s.sector_code = :sectorCode', { sectorCode });

    // Agregat rata-rata per jam
    const raw = await qb
      .select("TO_CHAR(DATE_TRUNC('hour', r.recorded_at), 'HH24:MI')", 'time')
      .addSelect('AVG(r.ch4_ppm)', 'ch4Ppm')
      .groupBy("DATE_TRUNC('hour', r.recorded_at)")
      .orderBy("DATE_TRUNC('hour', r.recorded_at)", 'ASC')
      .getRawMany();

    const latest = await this.readingRepo
      .createQueryBuilder('r')
      .innerJoin('r.node', 'n')
      .where('n.is_active = true')
      .orderBy('r.recorded_at', 'DESC')
      .select('r.ch4_ppm', 'ch4Ppm')
      .getRawOne();

    return {
      success: true,
      data: {
        currentCh4Ppm: latest ? parseFloat(latest.ch4Ppm) : null,
        dangerThreshold: 1000,
        series: raw.map((r) => ({ time: r.time, ch4Ppm: parseFloat(r.ch4Ppm) })),
      },
    };
  }

  /**
   * Simulasi pembacaan sensor realtime tanpa sensor fisik.
   * Setiap node mendapat nilai CH4 acak yang berfluktuasi realistis
   * dari nilai baseline-nya (sesuai data seed). Dipanggil setiap ~5 detik
   * oleh frontend untuk mensimulasikan data streaming.
   */
  async simulateReading() {
    const nodes = await this.nodeRepo.find({ relations: ['sector'] });

    // Baseline CH4 per node (ppm) — sesuai seed
    const baselines: Record<string, number> = {
      'B-07': 1490,
      'C-07': 1080,
      'B-12': 740,
      'A-04': 190,
      'A-09': 220,
      'D-02': 115,
    };

    const readings: Array<{
      nodeCode: string;
      sectorCode: string;
      ch4Ppm: number;
      status: string;
    }> = [];

    for (const node of nodes) {
      if (!node.isActive) continue;
      const base = baselines[node.nodeCode] ?? 300;
      // Fluktuasi yang lebih ekstrem agar pergerakan grafik sangat terlihat (real-time demo)
      // ±25% drift perlahan + ±15% noise acak setiap tick
      const drift = Math.sin(Date.now() / 20000) * base * 0.25;
      const noise = (Math.random() - 0.5) * base * 0.3;
      const ch4 = Math.max(0, Math.round(base + drift + noise));

      const status = ch4 >= 1000 ? 'danger' : ch4 >= 500 ? 'warning' : 'normal';

      // Persist to DB so historical chart can use real data
      await this.readingRepo.save(
        this.readingRepo.create({ nodeId: node.id, ch4Ppm: ch4, recordedAt: new Date() }),
      );
      await this.nodeRepo.update(node.id, { lastSeenAt: new Date() });

      readings.push({
        nodeCode: node.nodeCode,
        sectorCode: node.sector?.sectorCode ?? '?',
        ch4Ppm: ch4,
        status,
      });
    }

    // Overall worst status
    const overallStatus = readings.some((r) => r.status === 'danger')
      ? 'danger'
      : readings.some((r) => r.status === 'warning')
        ? 'warning'
        : 'normal';

    const avgCh4 = readings.length
      ? Math.round(readings.reduce((s, r) => s + r.ch4Ppm, 0) / readings.length)
      : 0;

    return {
      success: true,
      data: {
        simulatedAt: new Date().toISOString(),
        overallStatus,
        avgCh4Ppm: avgCh4,
        nodes: readings,
      },
    };
  }

  /**
   * Isi data historis dummy sepanjang hari ini ke database.
   * Dipanggil sekali dari frontend setelah login agar grafik CH4 tidak kosong.
   */
  async seedTodayHistory() {
    const nodes = await this.nodeRepo.find();

    const baselines: Record<string, number> = {
      'B-07': 1490,
      'C-07': 1080,
      'B-12': 740,
      'A-04': 190,
      'A-09': 220,
      'D-02': 115,
    };

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const currentHour = now.getHours();

    // Check if already seeded today (avoid duplicates)
    const existing = await this.readingRepo
      .createQueryBuilder('r')
      .where('r.recorded_at >= :start', { start: startOfDay })
      .getCount();

    if (existing > 20) {
      return { success: true, message: 'Data historis sudah ada', seeded: 0 };
    }

    const toInsert: any[] = [];
    for (const node of nodes) {
      if (!node.isActive) continue;
      const base = baselines[node.nodeCode] ?? 300;

      // Generate hourly readings from midnight to now
      for (let h = 0; h <= currentHour; h++) {
        const ts = new Date(startOfDay);
        ts.setHours(h, Math.floor(Math.random() * 60), 0, 0);
        // Gradual rise pattern typical of landfill gas
        const hourFactor = 0.85 + (h / 24) * 0.3;
        const noise = (Math.random() - 0.4) * base * 0.12;
        const ch4 = Math.max(0, Math.round(base * hourFactor + noise));
        toInsert.push(this.readingRepo.create({ nodeId: node.id, ch4Ppm: ch4, recordedAt: ts }));
      }
    }

    await this.readingRepo.save(toInsert);
    return {
      success: true,
      message: `${toInsert.length} data historis berhasil disisipkan`,
      seeded: toInsert.length,
    };
  }
}
