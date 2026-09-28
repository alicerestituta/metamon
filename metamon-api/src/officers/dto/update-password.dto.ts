import { IsString, IsNotEmpty, MinLength, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty() @IsString() @IsNotEmpty() currentPassword: string;
  @ApiProperty() @IsString() @MinLength(8) newPassword: string;
  @ApiPropertyOptional() @IsString() @Length(6, 6) @IsOptional() newPin?: string;
}
