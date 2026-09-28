import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIncidentDto {
  @ApiPropertyOptional() @IsString() @IsOptional() mitigationNotes?: string;
  @ApiPropertyOptional({ enum: ['open', 'resolved'] }) @IsString() @IsOptional() status?: string;
}
