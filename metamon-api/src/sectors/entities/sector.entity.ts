import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export type SectorStatus = 'normal' | 'warning' | 'danger' | 'locked';

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sector_code', length: 1, unique: true })
  sectorCode: string;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'capacity_percent', type: 'int', default: 0 })
  capacityPercent: number;

  @Column({ type: 'varchar', length: 10, default: 'normal' })
  status: SectorStatus;

  @Column({ name: 'is_accepting_trucks', default: true })
  isAcceptingTrucks: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
