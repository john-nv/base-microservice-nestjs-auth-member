import { ServiceName } from '@lib/common/enums';
import { ICustomRequest } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { parseJwtHeader } from '@lib/utils/helpers';
import { JwtStrategy } from '@lib/utils/middlewares/strategy';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {}

  private async validateRequest(
    request: ICustomRequest,
  ): Promise<IJwtPayload | boolean> {
    const checkDeviceId = request.fingerprint.hash;
    const headers = request.headers;

    const token = headers['authorization'] || null;
    if (!token) return false;
    const parsedToken = parseJwtHeader(token);

    const jwtPayload: IJwtPayload = JwtStrategy.decode(parsedToken);

    if (checkDeviceId !== jwtPayload.deviceId)
      throw new UnauthorizedException('Token not issued for this device');

    try {
      const secretKey = await this.serviceClient.sendMessage(
        ServiceName.AUTH_SERVICE,
        jwtPayload,
        {
          cmd: `${ServiceName.AUTH_SERVICE}.AuthController.getActiveDeviceSession`,
        },
      );

      if (!secretKey) return false;

      return !!JwtStrategy.verify(parsedToken, secretKey) ? jwtPayload : null;
    } catch (e) {
      return null;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const jwtPayload = await this.validateRequest(request);
      if (!jwtPayload) throw new UnauthorizedException();

      request.user = jwtPayload;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
