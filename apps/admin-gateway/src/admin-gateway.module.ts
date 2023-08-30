import { configuration } from '@lib/config';
import { HealthModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminGatewayController } from './admin-gateway.controller';
import { AuthServiceModule } from './auth';
import { MemberServiceModule } from './member';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HealthModule,
    AuthServiceModule,
    MemberServiceModule,
  ],
  controllers: [AdminGatewayController],
})
export class AdminGatewayModule {}
