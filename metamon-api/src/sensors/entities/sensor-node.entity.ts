import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Sector } from '../../sectors/entities/sector.entity';
import { SensorReading } from '../../readings/entities/sensor-reading.entity';

@Entity('sensor_nodes')
export class SensorNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'node_code', length: 10, unique: true })
  nodeCode: string;

  @ManyToOne(() => Sector)
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @Column({ name: 'sector_id' })
  sectorId: string;

  @Column({ name: 'battery_percent', type: 'int', default: 100 })
  batteryPercent: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_seen_at', type: 'timestamp', nullable: true })
  lastSeenAt: Date;

  @OneToMany(() => SensorReading, (r) => r.node)
  readings: SensorReading[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
