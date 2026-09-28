import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { SensorNode } from './entities/sensor-node.entity';
import { SensorReading } from '../readings/entities/sensor-reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SensorNode, SensorReading])],
  controllers: [SensorsController],
  providers: [SensorsService],
  exports: [SensorsService],
})
export class SensorsModule {}
