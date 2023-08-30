import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { Member } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Member],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
