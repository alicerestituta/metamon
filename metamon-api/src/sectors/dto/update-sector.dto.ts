import { IsString, IsInt, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSectorDto {
  @ApiPropertyOptional({ enum: ['normal', 'warning', 'danger', 'locked'] })
  @IsString() @IsOptional() status?: string;

  @ApiPropertyOptional() @IsInt() @Min(0) @Max(100) @IsOptional() capacityPercent?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isAcceptingTrucks?: boolean;
}
