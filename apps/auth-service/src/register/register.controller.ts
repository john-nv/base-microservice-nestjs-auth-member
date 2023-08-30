import { ServiceName } from '@lib/common/enums';
import { IRegisterMember } from '@lib/common/interfaces/modules/auth';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
  static prefixCmd = [ServiceName.AUTH_SERVICE, 'AuthController'];
  constructor(private readonly registerService: RegisterService) {}

  @MessagePattern({
    cmd: getPattern(
      RegisterController.prefixCmd,
      RegisterController.prototype.register.name,
    ),
  })
  register(payload: IRegisterMember) {
    return this.registerService.register(payload);
  }
}
