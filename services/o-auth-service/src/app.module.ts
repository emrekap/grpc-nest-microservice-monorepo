import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DataAccessModule } from './data-access/data-access.module';
import { OAuthService } from './o-auth/o-auth.service';
import { OAuthController } from './o-auth/o-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { OAuthModule } from './o-auth/o-auth.module';

@Module({
  imports: [ConfigModule, DataAccessModule, OAuthModule],
})
export class AppModule {}
