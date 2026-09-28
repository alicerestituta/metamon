import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { Sector } from '../sectors/entities/sector.entity';
import { SensorNode } from '../sensors/entities/sensor-node.entity';
import { SensorReading } from '../readings/entities/sensor-reading.entity';
import { Truck } from '../trucks/entities/truck.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sector, SensorNode, SensorReading, Truck])],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
