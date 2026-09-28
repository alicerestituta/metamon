import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationsDto {
  @ApiPropertyOptional() @IsBoolean() @IsOptional() methaneAlert?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() dailyReport?: boolean;
}
