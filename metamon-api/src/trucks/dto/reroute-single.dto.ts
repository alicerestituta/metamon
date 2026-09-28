import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RerouteSingleDto {
  @ApiProperty({ example: 'A' }) @IsString() @IsNotEmpty() toSectorCode: string;
}
