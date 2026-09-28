import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { Sector } from './entities/sector.entity';
import { SensorReading } from '../readings/entities/sensor-reading.entity';
import { SensorNode } from '../sensors/entities/sensor-node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sector, SensorReading, SensorNode])],
  controllers: [SectorsController],
  providers: [SectorsService],
  exports: [SectorsService],
})
export class SectorsModule {}
