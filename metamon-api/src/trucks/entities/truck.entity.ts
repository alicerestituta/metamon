import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sector } from '../../sectors/entities/sector.entity';

@Entity('trucks')
export class Truck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plate_number', length: 20, unique: true })
  plateNumber: string;

  @ManyToOne(() => Sector)
  @JoinColumn({ name: 'original_sector_id' })
  originalSector: Sector;

  @Column({ name: 'original_sector_id' })
  originalSectorId: string;

  @ManyToOne(() => Sector, { nullable: true })
  @JoinColumn({ name: 'rerouted_sector_id' })
  reroutedSector: Sector;

  @Column({ name: 'rerouted_sector_id', nullable: true })
  reroutedSectorId: string;

  @Column({ name: 'is_rerouted', default: false })
  isRerouted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
