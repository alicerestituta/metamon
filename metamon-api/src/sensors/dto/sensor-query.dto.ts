import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SensorQueryDto {
  @ApiPropertyOptional({ enum: ['A', 'B', 'C', 'D'] }) @IsString() @IsOptional() sector?: string;
  @ApiPropertyOptional({ enum: ['normal', 'warning', 'danger'] })
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() search?: string;
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;
  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
