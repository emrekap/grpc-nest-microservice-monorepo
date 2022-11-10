import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OAuthModule } from './o-auth/o-auth.module';

@Module({
  imports: [AuthModule, OAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
