import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sector } from '../../sectors/entities/sector.entity';
import { Officer } from '../../officers/entities/officer.entity';

export type IncidentStatus = 'open' | 'resolved';

@Entity('incident_logs')
export class IncidentLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  description: string;

  @Column({ name: 'mitigation_notes', type: 'text', nullable: true })
  mitigationNotes: string;

  @ManyToOne(() => Sector, { nullable: true })
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @Column({ name: 'sector_id', nullable: true })
  sectorId: string;

  @ManyToOne(() => Officer, { nullable: true })
  @JoinColumn({ name: 'officer_id' })
  officer: Officer;

  @Column({ name: 'officer_id', nullable: true })
  officerId: string;

  @Column({ type: 'varchar', length: 10, default: 'open' })
  status: IncidentStatus;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
