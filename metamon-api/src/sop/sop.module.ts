import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SopController } from './sop.controller';
import { SopService } from './sop.service';
import { SopTask } from './entities/sop-task.entity';
import { IncidentLog } from './entities/incident-log.entity';
import { Sector } from '../sectors/entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SopTask, IncidentLog, Sector])],
  controllers: [SopController],
  providers: [SopService],
})
export class SopModule {}
