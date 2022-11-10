import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OAUTH_PACKAGE_NAME, O_AUTH_SERVICE_NAME } from '../protos/oauth.pb';
import { OAuthController } from './o-auth.controller';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: O_AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: OAUTH_PACKAGE_NAME,
          protoPath: 'node_modules/@grpc-monorepo/proto/oauth.proto',
        },
      },
    ]),
  ],
  controllers: [OAuthController],
})
export class OAuthModule {}
