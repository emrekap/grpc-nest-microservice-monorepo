import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DataAccessModule } from './data-access/data-access.module';

@Module({
  imports: [ConfigModule, DataAccessModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
