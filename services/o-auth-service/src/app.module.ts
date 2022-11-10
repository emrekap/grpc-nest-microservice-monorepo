import { Module } from "@nestjs/common";
import { AuthModule } from "./service-module/service.module";
import { ConfigModule } from "./config/config.module";
import { DataAccessModule } from "./data-access/data-access.module";

@Module({
  imports: [ConfigModule, DataAccessModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
