import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true); // Drop & Recreate DB
  console.log('🌱 Seeding database Metamon...');

  const sectorRepo = AppDataSource.getRepository('sectors');
  const nodeRepo = AppDataSource.getRepository('sensor_nodes');
  const readingRepo = AppDataSource.getRepository('sensor_readings');
  const officerRepo = AppDataSource.getRepository('officers');
  const truckRepo = AppDataSource.getRepository('trucks');
  const taskRepo = AppDataSource.getRepository('sop_tasks');
  const incidentRepo = AppDataSource.getRepository('incident_logs');

  // SECTORS
  const sectorData = [
    {
      sectorCode: 'A',
      name: 'Sektor A',
      capacityPercent: 42,
      status: 'normal',
      isAcceptingTrucks: true,
    },
    {
      sectorCode: 'B',
      name: 'Sektor B',
      capacityPercent: 100,
      status: 'locked',
      isAcceptingTrucks: false,
    },
    {
      sectorCode: 'C',
      name: 'Sektor C',
      capacityPercent: 60,
      status: 'warning',
      isAcceptingTrucks: true,
    },
    {
      sectorCode: 'D',
      name: 'Sektor D',
      capacityPercent: 68,
      status: 'warning',
      isAcceptingTrucks: true,
    },
  ];
  const sectors = await sectorRepo.save(sectorData);
  const sectorMap = Object.fromEntries(sectors.map((s: any) => [s.sectorCode, s]));
  console.log('✅ Sectors seeded');

  // SENSOR NODES
  const nodeData = [
    { nodeCode: 'B-07', sectorId: sectorMap['B'].id, batteryPercent: 72, isActive: true },
    { nodeCode: 'C-07', sectorId: sectorMap['C'].id, batteryPercent: 88, isActive: true },
    { nodeCode: 'B-12', sectorId: sectorMap['B'].id, batteryPercent: 94, isActive: true },
    { nodeCode: 'A-04', sectorId: sectorMap['A'].id, batteryPercent: 98, isActive: true },
    { nodeCode: 'A-09', sectorId: sectorMap['A'].id, batteryPercent: 76, isActive: true },
    { nodeCode: 'D-02', sectorId: sectorMap['D'].id, batteryPercent: 100, isActive: true },
    { nodeCode: 'B-15', sectorId: sectorMap['B'].id, batteryPercent: 45, isActive: true },
    { nodeCode: 'C-02', sectorId: sectorMap['C'].id, batteryPercent: 91, isActive: true },
    { nodeCode: 'D-08', sectorId: sectorMap['D'].id, batteryPercent: 82, isActive: true },
    { nodeCode: 'A-12', sectorId: sectorMap['A'].id, batteryPercent: 68, isActive: true },
  ];
  const nodes = await nodeRepo.save(nodeData);
  const nodeMap = Object.fromEntries(nodes.map((n: any) => [n.nodeCode, n]));
  console.log('✅ Sensor nodes seeded');

  // SENSOR READINGS (nilai terkini)
  const readingData = [
    { nodeId: nodeMap['B-07'].id, ch4Ppm: 1490, recordedAt: new Date() },
    { nodeId: nodeMap['C-07'].id, ch4Ppm: 1428, recordedAt: new Date() },
    { nodeId: nodeMap['B-12'].id, ch4Ppm: 740, recordedAt: new Date() },
    { nodeId: nodeMap['A-04'].id, ch4Ppm: 190, recordedAt: new Date() },
    { nodeId: nodeMap['A-09'].id, ch4Ppm: 220, recordedAt: new Date() },
    { nodeId: nodeMap['D-02'].id, ch4Ppm: 115, recordedAt: new Date() },
    { nodeId: nodeMap['B-15'].id, ch4Ppm: 1650, recordedAt: new Date() },
    { nodeId: nodeMap['C-02'].id, ch4Ppm: 680, recordedAt: new Date() },
    { nodeId: nodeMap['D-08'].id, ch4Ppm: 145, recordedAt: new Date() },
    { nodeId: nodeMap['A-12'].id, ch4Ppm: 310, recordedAt: new Date() },
  ];
  await readingRepo.save(readingData);
  console.log('✅ Sensor readings seeded');

  // OFFICER
  const passwordHash = await bcrypt.hash('admin123', 12);
  const officer = await officerRepo.save({
    name: 'Ratna Sari Dewi',
    credentials: 'S.T., M.Ling.',
    nip: '19880415 201201 2 004',
    role: 'Koordinator Keselamatan Lingkungan & K3 TPA',
    avatarUrl: '/officer_ratna.jpg',
    passwordHash,
    methaneAlertNotif: true,
    dailyReportNotif: true,
  });

  await officerRepo.save([
    {
      name: 'Budi Santoso',
      credentials: 'S.T.',
      nip: '19900512 201502 1 001',
      role: 'Petugas Lapangan Zona A & B',
      avatarUrl: '',
      passwordHash,
      methaneAlertNotif: true,
      dailyReportNotif: false,
    },
    {
      name: 'Andi Wijaya',
      credentials: 'A.Md.T.',
      nip: '19921108 201703 1 002',
      role: 'Petugas Lapangan Zona C & D',
      avatarUrl: '',
      passwordHash,
      methaneAlertNotif: true,
      dailyReportNotif: false,
    },
    {
      name: 'Siti Aminah',
      credentials: 'S.Si.',
      nip: '19850220 201001 2 003',
      role: 'Analis Data Lingkungan',
      avatarUrl: '',
      passwordHash,
      methaneAlertNotif: false,
      dailyReportNotif: true,
    },
  ]);
  console.log('✅ Officer seeded — NIP:', (officer as any).nip, '/ Password: admin123');

  // TRUCKS
  await truckRepo.save([
    {
      plateNumber: 'B 9812 UOX',
      originalSectorId: sectorMap['B'].id,
      reroutedSectorId: sectorMap['C'].id,
      isRerouted: true,
    },
    {
      plateNumber: 'B 5729 UOX',
      originalSectorId: sectorMap['B'].id,
      reroutedSectorId: sectorMap['C'].id,
      isRerouted: true,
    },
    {
      plateNumber: 'B 1122 KAA',
      originalSectorId: sectorMap['B'].id,
      reroutedSectorId: sectorMap['A'].id,
      isRerouted: true,
    },
    {
      plateNumber: 'B 3344 LPO',
      originalSectorId: sectorMap['B'].id,
      reroutedSectorId: sectorMap['D'].id,
      isRerouted: true,
    },
    { plateNumber: 'B 3411 UOX', originalSectorId: sectorMap['A'].id, isRerouted: false },
    { plateNumber: 'B 9102 KAA', originalSectorId: sectorMap['D'].id, isRerouted: false },
    { plateNumber: 'B 7765 JKL', originalSectorId: sectorMap['A'].id, isRerouted: false },
    { plateNumber: 'B 2298 MNO', originalSectorId: sectorMap['C'].id, isRerouted: false },
    { plateNumber: 'B 4431 PQR', originalSectorId: sectorMap['C'].id, isRerouted: false },
    { plateNumber: 'B 8856 STU', originalSectorId: sectorMap['D'].id, isRerouted: false },
    { plateNumber: 'B 6623 VWX', originalSectorId: sectorMap['A'].id, isRerouted: false },
    { plateNumber: 'B 5519 YZA', originalSectorId: sectorMap['C'].id, isRerouted: false },
  ]);
  console.log('✅ Trucks seeded');

  // SOP TASKS
  await taskRepo.save([
    {
      title: 'Sterilisasi Perimeter Zona Merah (Radius 50m)',
      isCompleted: true,
      completedAt: new Date('2026-09-27T10:14:00'),
      orderIndex: 1,
    },
    {
      title: 'Pengalihan Lalu Lintas Truk ke Sektor C',
      isCompleted: true,
      completedAt: new Date('2026-09-27T10:18:00'),
      orderIndex: 2,
    },
    { title: 'Eksekusi Aerasi Sampah (Pengerukan Ekskavator)', isCompleted: false, orderIndex: 3 },
    { title: 'Injeksi Air Pendingin ke Pipa Sensor', isCompleted: false, orderIndex: 4 },
  ]);
  console.log('✅ SOP tasks seeded');

  // INCIDENT LOGS
  await incidentRepo.save([
    {
      title: 'Tekanan Balik Pipa Lindi',
      description: 'Pembersihan sedimentasi kerak & flushing katup primer sektor B.',
      sectorId: sectorMap['B'].id,
      status: 'resolved',
      resolvedAt: new Date('2026-09-27T08:30:00'),
    },
    {
      title: 'Saturasi Gas Dekat Jalan Masuk',
      description: 'Aerasi portabel & penutupan membrane geomembrane tambahan sektor B.',
      sectorId: sectorMap['B'].id,
      status: 'resolved',
      resolvedAt: new Date('2026-09-26T14:15:00'),
    },
    {
      title: 'Sensor C-07 Kehilangan Koneksi',
      description: 'Penggantian baterai pada sensor C-07 karena daya drop mendadak.',
      sectorId: sectorMap['C'].id,
      status: 'resolved',
      resolvedAt: new Date('2026-09-28T10:20:00'),
    },
    {
      title: 'Lonjakan Metana Ekstrem di Area Terbuka',
      description: 'Inspeksi menemukan robekan pada geomembrane. Ditambal darurat.',
      sectorId: sectorMap['B'].id,
      status: 'open',
      resolvedAt: null,
    },
    {
      title: 'Sistem Pompa Lindi Error',
      description: 'Pompa utama Sektor A mengalami overheat dan dimatikan otomatis.',
      sectorId: sectorMap['A'].id,
      status: 'open',
      resolvedAt: null,
    },
  ]);
  console.log('✅ Incident logs seeded');

  console.log('\n🎉 Seed selesai! Metamon API siap digunakan.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed gagal:', err);
  process.exit(1);
});
