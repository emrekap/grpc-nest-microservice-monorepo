import { Module } from "@nestjs/common";
import { ConfigModule } from "src/config/config.module";
import { DataAccessModule } from "src/data-access/data-access.module";
import { ServiceController } from "./service.controller";

import { ServiceRepository } from "./service-repository";

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [ServiceController],
  providers: [ServiceRepository],
})
export class AuthModule {}
