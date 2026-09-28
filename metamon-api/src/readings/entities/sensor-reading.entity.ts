import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SensorNode } from '../../sensors/entities/sensor-node.entity';

@Entity('sensor_readings')
@Index(['nodeId', 'recordedAt'])
export class SensorReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SensorNode, (n) => n.readings)
  @JoinColumn({ name: 'node_id' })
  node: SensorNode;

  @Column({ name: 'node_id' })
  nodeId: string;

  @Column({ name: 'ch4_ppm', type: 'decimal', precision: 10, scale: 2 })
  ch4Ppm: number;

  @Column({ name: 'temperature_celsius', type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatureCelsius: number;

  @Column({ name: 'recorded_at', type: 'timestamp' })
  recordedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
