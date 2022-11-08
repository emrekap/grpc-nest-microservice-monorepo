import { Module } from '@nestjs/common';
import { Config, configFactory } from './config-factory';

@Module({
  providers: [configFactory],
  exports: [Config],
})
export class ConfigModule {}
