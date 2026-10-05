import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OfficersService } from '../officers/officers.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly officersService: OfficersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const officer = await this.officersService.findByNip(dto.nip);
    if (!officer) throw new UnauthorizedException('NIP atau password salah');

    const isMatch = await bcrypt.compare(dto.password, officer.passwordHash);
    if (!isMatch) throw new UnauthorizedException('NIP atau password salah');

    await this.officersService.createAuditLog(officer.id, {
      deviceName: dto.deviceName ?? 'Unknown Device',
      ipAddress: dto.ipAddress ?? '0.0.0.0',
      locationNote: dto.locationNote,
    });

    const payload = {
      sub: officer.id,
      nip: officer.nip,
      name: officer.name,
      accessLevel: officer.accessLevel,
    };
    return {
      success: true,
      data: {
        accessToken: this.jwtService.sign(payload),
        officer: {
          id: officer.id,
          name: officer.name,
          role: officer.role,
          accessLevel: officer.accessLevel,
          avatarUrl: officer.avatarUrl,
        },
      },
    };
  }

  async logout(officerId: string) {
    await this.officersService.deactivateAuditLog(officerId);
    return { success: true, message: 'Berhasil keluar dari akun petugas' };
  }

  async getMe(officerId: string) {
    return this.officersService.findOne(officerId);
  }
}
