import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Officer } from '../../officers/entities/officer.entity';

@Entity('sop_tasks')
export class SopTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => Officer, { nullable: true })
  @JoinColumn({ name: 'completed_by_id' })
  completedBy: Officer;

  @Column({ name: 'completed_by_id', nullable: true })
  completedById: string;

  @Column({ name: 'order_index', type: 'int' })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
