import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IncidentQueryDto {
  @ApiPropertyOptional({ enum: ['open', 'resolved', 'all'] }) @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() sectorCode?: string;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(1) @IsOptional() page?: number;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(1) @IsOptional() limit?: number;
}
