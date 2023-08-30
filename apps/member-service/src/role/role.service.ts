import { DbName } from '@lib/common/enums';
import { Role } from '@lib/core/databases/postgres';
import { BaseRepository } from '@lib/core/base';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RoleService extends BaseRepository {
  private readonly serviceName: string = RoleService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getOrCreate(name: string): Promise<Role> {
    try {
      const role = await this.getOne(this.dataSourcePostgres, Role, {
        where: {
          name,
        },
      });

      if (role) return role;

      const newRole = this.createInstance(this.dataSourcePostgres, Role, {
        name,
      });

      await this.create(this.dataSourcePostgres, Role, newRole);

      return newRole;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
