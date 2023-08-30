import { ServiceName } from '@lib/common/enums';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { JwtGuard } from '@lib/utils/middlewares';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateRegisterCodeDto, QueryRegCodeDto, RegisterCodeDto } from './dto';
import {
  IMessage,
  IPatternMessage,
  IQueryMessage,
} from '@lib/common/interfaces';
import { PaginateDto } from '@lib/common/dto';
import { RegisterCode } from '@lib/core/databases/postgres';
import { BaseGatewayController } from '@lib/core/base';

@Controller('register-code')
@ApiTags('Member Service')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class RegisterCodeController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(RegisterCodeController.name, ServiceName.MEMBER_SERVICE);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update/:id')
  updateRegisterCode(
    @Param('id') id: string,
    @Body() payload: UpdateRegisterCodeDto,
  ) {
    const functionName =
      RegisterCodeController.prototype.updateRegisterCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<RegisterCodeDto> = { id, payload };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('create')
  createRegisterCode(@Body() payload: RegisterCodeDto) {
    const functionName =
      RegisterCodeController.prototype.createRegisterCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<RegisterCodeDto> = { payload };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('listing')
  getListRegisterCode(
    @Query() query: PaginateDto,
    @Body() payload: QueryRegCodeDto,
  ) {
    const functionName =
      RegisterCodeController.prototype.getListRegisterCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<IQueryMessage<RegisterCode>> = {
      payload: { ...query, ...payload },
    };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getRegisterCodeById(@Param('id') id: string) {
    const functionName =
      RegisterCodeController.prototype.getRegisterCodeById.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { id };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteRegisterCode(@Param('id') id: string) {
    const functionName =
      RegisterCodeController.prototype.deleteRegisterCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { id };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }
}
