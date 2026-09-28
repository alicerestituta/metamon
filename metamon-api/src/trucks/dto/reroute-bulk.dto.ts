import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RerouteBulkDto {
  @ApiProperty({ example: 'B' }) @IsString() @IsNotEmpty() fromSectorCode: string;
  @ApiProperty({ example: 'C' }) @IsString() @IsNotEmpty() toSectorCode: string;
}
