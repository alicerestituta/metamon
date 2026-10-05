import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard yang hanya mengizinkan officer dengan accessLevel = 'admin'.
 * User lapangan (field) tidak bisa mengakses endpoint yang dilindungi guard ini.
 */
@Injectable()
export class AdminOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.accessLevel !== 'admin') {
      throw new ForbiddenException('Akses ditolak. Hanya administrator yang dapat melakukan tindakan ini.');
    }

    return true;
  }
}
