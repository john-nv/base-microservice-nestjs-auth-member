import { ServiceName } from '@lib/common/enums';
import { Role } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, RoleController.name];
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({
    cmd: getPattern(
      RoleController.prefixCmd,
      RoleController.prototype.getOrCreate.name,
    ),
  })
  getOrCreate(groupName: string): Promise<Role> {
    return this.roleService.getOrCreate(groupName);
  }
}
