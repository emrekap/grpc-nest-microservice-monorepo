import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DataAccessModule } from './data-access/data-access.module';
import { OAuthService } from './o-auth/o-auth.service';
import { OAuthController } from './o-auth/o-auth.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    DataAccessModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class AppModule {}
