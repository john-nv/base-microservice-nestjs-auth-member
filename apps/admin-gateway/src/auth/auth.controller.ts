import { localIp } from '@lib/common/constants';
import { UserDecorator } from '@lib/common/decorators';
import { ServiceName } from '@lib/common/enums';
import {
  IJwtPayload,
  IJwtResponse,
  ILoginPayload,
} from '@lib/common/interfaces/modules/auth';
import { ICustomRequest, IGatewayError } from '@lib/common/interfaces/request';
import { IMutationResponse } from '@lib/common/interfaces/response';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { ResponseResult } from '@lib/common/types';
import { BaseGatewayController } from '@lib/core/base';
import { Member } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { JwtGuard } from '@lib/utils/middlewares';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto, LogoutDto, RefreshTokenDto, RegisterDto } from './dto';

@Controller('auth')
@ApiTags('Authenticate Service')
export class AuthController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(AuthController.name, ServiceName.AUTH_SERVICE);
  }

  @Get('health')
  async healthCheck() {
    const pattern: IPatternMessage = { cmd: 'auth.healthCheck' };
    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      {},
      pattern,
    );
  }

  @Post('login')
  async login(
    @Req() request: ICustomRequest,
    @Body() payload: LoginDto,
  ): Promise<ResponseResult<IJwtResponse>> {
    const functionName = AuthController.prototype.login.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const { hash = '', components = {} } = request.fingerprint;
    const ipAddress = request.connection.remoteAddress.split(':').pop();
    const userAgent = request.headers['user-agent'];
    const country = components.geoip.country;
    const deviceId = hash;

    const message: ILoginPayload = {
      loginPayload: payload,
      fingerPrint: {
        country,
        deviceId,
        userAgent,
        ipAddress: ipAddress === '1' ? localIp : ipAddress,
      },
    };

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      message,
      pattern,
    );
  }

  @Post('register')
  async register(
    @Body() payload: RegisterDto,
  ): Promise<ResponseResult<boolean>> {
    const functionName = AuthController.prototype.register.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      payload,
      pattern,
    );
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() request: ICustomRequest,
    @Body() payload: RefreshTokenDto,
  ): Promise<ResponseResult<boolean>> {
    const functionName = AuthController.prototype.refreshToken.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const { hash = '' } = request.fingerprint;
    const deviceId = hash;

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      { ...payload, deviceId },
      pattern,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('session')
  async getSession(@UserDecorator() user: IJwtPayload): Promise<IJwtPayload> {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(
    @UserDecorator() user: IJwtPayload,
  ): Promise<Member | IGatewayError> {
    const functionName = AuthController.prototype.getProfile.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      user.memberId,
      pattern,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(
    @UserDecorator() user: IJwtPayload,
    @Body() payload: LogoutDto,
  ): Promise<ResponseResult<IMutationResponse>> {
    const functionName = AuthController.prototype.logout.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      { ...user, deviceId: payload.deviceId },
      pattern,
    );
  }
}
