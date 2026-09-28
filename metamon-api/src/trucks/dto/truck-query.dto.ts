import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TruckQueryDto {
  @ApiPropertyOptional({ enum: ['all', 'rerouted', 'normal'] })
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() search?: string;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(1) @IsOptional() page?: number;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(1) @IsOptional() limit?: number;
}
