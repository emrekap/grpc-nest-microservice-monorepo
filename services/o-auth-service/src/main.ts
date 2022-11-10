import { INestMicroservice, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./service-module/filter/http-exception.filter";
import { protobufPackage } from "./service-module/auth.pb";

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: "0.0.0.0:50051",
        package: protobufPackage,
        protoPath: "node_modules/@grpc-monorepo/proto/auth.proto",
      },
    }
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
}

bootstrap();
