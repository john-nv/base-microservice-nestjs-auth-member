import { mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import {
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { IRegisterCode } from '@lib/common/interfaces/modules/register-code';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member, RegisterCode } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Not } from 'typeorm';

@Injectable()
export class RegisterCodeService extends BaseRepository {
  private readonly serviceName: string = RegisterCodeService.name;
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

  async createRegisterCode(
    payload: IRegisterCode,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { memberId, recommendCode } = payload;
      const [member, isExit] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Member, {
          where: {
            id: memberId,
          },
        }),
        this.getOne(this.dataSourcePostgres, RegisterCode, {
          where: { recommendCode },
        }),
      ]);

      if (!member) throw new NotFoundException('Not found member');
      if (isExit) throw new BadRequestException('Duplicate recommend code');
      const registerCodeInstance = this.createInstance(
        this.dataSourcePostgres,
        RegisterCode,
        {
          ...payload,
          owner: member,
        },
      );

      await this.dataSourcePostgres.manager.save(registerCodeInstance);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateRegisterCode(
    id: string,
    payload: IRegisterCode,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { memberId, recommendCode } = payload;
      const [member, exit] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Member, {
          where: {
            id: memberId,
          },
        }),
        this.getOne(this.dataSourcePostgres, RegisterCode, {
          where: { recommendCode, id: Not(id) },
        }),
      ]);

      if (!member) throw new NotFoundException('Not found member');
      if (exit) throw new BadRequestException('Duplicate recommend code');

      await this.update(this.dataSourcePostgres, RegisterCode, { id }, payload);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getListRegisterCode(
    query: IQueryMessage<RegisterCode>,
  ): Promise<ResponseResult<IPaginationResponse<RegisterCode>>> {
    try {
      const { page = 1, size = 20, queryFields } = query;
      const { type, ...rest } = queryFields;

      const queryList: FindOptionsWhere<RegisterCode> = {};

      for (const key in rest) {
        queryList[key] = ILike(`${rest[key]}%`);
      }

      if (type) Object.assign(queryList, { type });

      const results = await this.getPagination(
        this.dataSourcePostgres,
        RegisterCode,
        { page, size },
        {
          where: queryList,
          relations: {
            member: true,
          },
          select: {
            id: true,
            bonus: true,
            recommendCode: true,
            registrationDate: true,
            type: true,
            detail: true,
            member: {
              id: true,
              username: true,
            },
          },
        },
      );

      return results;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getRegisterCodeById(id: string): Promise<ResponseResult<RegisterCode>> {
    try {
      const result = await this.getOne(this.dataSourcePostgres, RegisterCode, {
        where: { id },
        relations: {
          member: true,
        },
        select: {
          id: true,
          bonus: true,
          recommendCode: true,
          registrationDate: true,
          type: true,
          detail: true,
          member: {
            id: true,
            username: true,
          },
        },
      });

      return result;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRegisterCode(
    id: string,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.delete(this.dataSourcePostgres, RegisterCode, {
        id,
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
