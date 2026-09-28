import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { SensorReading } from './entities/sensor-reading.entity';
import { SensorNode } from '../sensors/entities/sensor-node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SensorReading, SensorNode])],
  controllers: [ReadingsController],
  providers: [ReadingsService],
  exports: [ReadingsService],
})
export class ReadingsModule {}
