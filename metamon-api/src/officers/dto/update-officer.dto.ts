import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOfficerDto {
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() credentials?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() nip?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() role?: string;
}
