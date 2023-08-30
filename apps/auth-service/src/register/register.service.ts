import { mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { IRegisterMember } from '@lib/common/interfaces/modules/auth';
import { IMutationResponse } from '@lib/common/interfaces/response';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member, RegisterCode } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { CryptoService, LoggerService } from '@lib/utils/modules';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RegisterService extends BaseRepository {
  private readonly serviceName: string = RegisterService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly cryptoService: CryptoService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async register(
    payload: IRegisterMember,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { username, nickName, recommenderCode, ...member } = payload;
      let { password, exchangePassword } = payload;

      const [checkExistedAccount, registerCode] = await Promise.all([
        this.getMany(this.dataSourcePostgres, Member, {
          where: [{ username }, { nickName }],
        }),
        this.getOne(this.dataSourcePostgres, RegisterCode, {
          where: {
            recommendCode: recommenderCode,
          },
          relations: {
            owner: {
              recommended: true,
            },
          },
        }),
      ]);

      if (!registerCode)
        throw new BadRequestException('RecommendCode is not exist');
      if (checkExistedAccount.length > 0)
        throw new BadRequestException('Username or Nickname existed');

      [password, exchangePassword] = [
        this.cryptoService.computeSHA1OfMD5(password),
        this.cryptoService.computeSHA1OfMD5(exchangePassword),
      ];

      const newMember = this.createInstance(this.dataSourcePostgres, Member, {
        ...member,
        username,
        password,
        nickName,
        exchangePassword,
        recommender: registerCode.owner,
        recommendedCode: registerCode,
      });

      await this.dataSourcePostgres.manager.save(Member, [
        newMember,
        {
          ...registerCode.owner,
          recommended: [newMember, ...registerCode.owner.recommended],
        },
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
