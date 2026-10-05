import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReadingDto {
  @ApiProperty({ example: 'B-07' }) @IsString() @IsNotEmpty() nodeCode: string;
  @ApiProperty({ example: 1490.5 }) @IsNumber() ch4Ppm: number;
  @ApiPropertyOptional({ example: 32.5 }) @IsNumber() @IsOptional() temperatureCelsius?: number;
  @ApiPropertyOptional({ example: 85, description: 'Persentase baterai node (0-100)' })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  batteryPercent?: number;
  @ApiPropertyOptional() @IsDateString() @IsOptional() recordedAt?: string;
}
