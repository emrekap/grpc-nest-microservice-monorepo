import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config/config.module';
import { DataAccessModule } from '../data-access/data-access.module';
import { OAuthController } from './o-auth.controller';
import { OAuthService } from './o-auth.service';

@Module({
  imports: [
    ConfigModule,
    DataAccessModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule {}
