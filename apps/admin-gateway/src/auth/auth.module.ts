import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [AuthController],
})
export class AuthServiceModule {}
