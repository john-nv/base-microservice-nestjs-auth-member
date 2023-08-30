import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { getPattern } from '@lib/utils/helpers';
import { JwtGuard } from '@lib/utils/middlewares';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryProfileDto } from './dto';

@Controller('profiles')
@ApiTags('Member Service')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {}

  private readonly prefixCmd = [
    ServiceName.MEMBER_SERVICE,
    ProfileController.name,
  ];

  @HttpCode(HttpStatus.OK)
  @Post()
  getMembers(@Body() payload: QueryProfileDto) {
    const pattern = {
      cmd: getPattern(
        this.prefixCmd,
        ProfileController.prototype.getMembers.name,
      ),
    };
    const message: IMessage = { payload };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }
}
