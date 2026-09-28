import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';
import { Truck } from './entities/truck.entity';
import { Sector } from '../sectors/entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Truck, Sector])],
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService],
})
export class TrucksModule {}
