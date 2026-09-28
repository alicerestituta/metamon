import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '19880415 201201 2 004' })
  @IsString() @IsNotEmpty()
  nip: string;

  @ApiProperty({ example: 'admin123' })
  @IsString() @IsNotEmpty()
  password: string;

  // Diisi dari request context (IP, User-Agent), bukan dari body
  deviceName?: string;
  ipAddress?: string;
  locationNote?: string;
}
