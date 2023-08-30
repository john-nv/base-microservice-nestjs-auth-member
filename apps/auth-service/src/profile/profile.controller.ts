import { ServiceName } from '@lib/common/enums';
import { ResponseResult } from '@lib/common/types';
import { Member } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  static prefixCmd = [ServiceName.AUTH_SERVICE, 'AuthController'];
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({
    cmd: getPattern(
      ProfileController.prefixCmd,
      ProfileController.prototype.getProfile.name,
    ),
  })
  getProfile(memberId: string): Promise<ResponseResult<Member>> {
    return this.profileService.getProfile(memberId);
  }
}
