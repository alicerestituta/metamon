import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Officer } from './officer.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Officer, (o) => o.auditLogs)
  @JoinColumn({ name: 'officer_id' })
  officer: Officer;

  @Column({ name: 'officer_id' })
  officerId: string;

  @Column({ name: 'device_name', length: 150 })
  deviceName: string;

  @Column({ name: 'ip_address', length: 45 })
  ipAddress: string;

  @Column({ name: 'location_note', length: 200, nullable: true })
  locationNote: string;

  @Column({ name: 'is_active_session', default: false })
  isActiveSession: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
