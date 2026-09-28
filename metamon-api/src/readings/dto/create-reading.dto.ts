import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReadingDto {
  @ApiProperty({ example: 'B-07' }) @IsString() @IsNotEmpty() nodeCode: string;
  @ApiProperty({ example: 1490.5 }) @IsNumber() ch4Ppm: number;
  @ApiPropertyOptional({ example: 52.0 }) @IsNumber() @IsOptional() temperatureCelsius?: number;
  @ApiPropertyOptional() @IsDateString() @IsOptional() recordedAt?: string;
}
