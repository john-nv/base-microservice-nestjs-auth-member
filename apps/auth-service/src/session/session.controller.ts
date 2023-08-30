import { ServiceName } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import {
  IJwtPayload,
  IJwtResponse,
  ILoginPayload,
  IRefreshTokenPayload,
} from '@lib/common/interfaces/modules/auth';
import { ResponseResult } from '@lib/common/types';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SessionService } from './session.service';

@Controller()
export class SessionController {
  static prefixCmd = [ServiceName.AUTH_SERVICE, 'AuthController'];
  constructor(private readonly sessionService: SessionService) {}

  @MessagePattern({
    cmd: getPattern(
      SessionController.prefixCmd,
      SessionController.prototype.login.name,
    ),
  })
  login(payload: ILoginPayload): Promise<ResponseResult<IJwtResponse>> {
    return this.sessionService.login(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      SessionController.prefixCmd,
      SessionController.prototype.refreshToken.name,
    ),
  })
  refreshToken(
    payload: IRefreshTokenPayload,
  ): Promise<ResponseResult<IJwtResponse>> {
    const { deviceId, refreshToken } = payload;
    return this.sessionService.refreshToken(deviceId, refreshToken);
  }

  @MessagePattern({
    cmd: getPattern(
      SessionController.prefixCmd,
      SessionController.prototype.getActiveDeviceSession.name,
    ),
  })
  getActiveDeviceSession(payload: IJwtPayload): Promise<string | null> {
    return this.sessionService.getActiveDeviceSession(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      SessionController.prefixCmd,
      SessionController.prototype.logout.name,
    ),
  })
  logout(payload: IJwtPayload): Promise<ResponseResult<IMutationResponse>> {
    return this.sessionService.logout(payload);
  }
}
