import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuditLog } from './audit-log.entity';

export enum AccessLevel {
  ADMIN = 'admin',
  FIELD = 'field',
}

@Entity('officers')
export class Officer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  credentials: string;

  @Column({ length: 30, unique: true })
  nip: string;

  @Column('text')
  role: string;

  @Column({
    name: 'access_level',
    type: 'enum',
    enum: AccessLevel,
    default: AccessLevel.FIELD,
  })
  accessLevel: AccessLevel;

  @Column({ name: 'avatar_url', length: 255 })
  avatarUrl: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'pin_hash', length: 255, nullable: true })
  pinHash: string;

  @Column({ name: 'methane_alert_notif', default: true })
  methaneAlertNotif: boolean;

  @Column({ name: 'daily_report_notif', default: true })
  dailyReportNotif: boolean;

  @OneToMany(() => AuditLog, (log) => log.officer)
  auditLogs: AuditLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
