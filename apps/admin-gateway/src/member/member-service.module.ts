import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { MemberServiceController } from './member-service.controller';
import { ProfileModule } from './profile';
import { RegisterCodeModule } from './register-code';

const Modules = [ProfileModule, RegisterCodeModule];

@Module({
  imports: [ServiceProviderModule, ...Modules],
  controllers: [MemberServiceController],
})
export class MemberServiceModule {}
