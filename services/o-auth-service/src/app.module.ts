import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DataAccessModule } from './data-access/data-access.module';
import { OAuthService } from './o-auth/o-auth.service';
import { OAuthController } from './o-auth/o-auth.controller';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class AppModule {}
