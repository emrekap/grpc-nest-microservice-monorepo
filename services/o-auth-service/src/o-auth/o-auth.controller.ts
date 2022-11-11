import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  InstagramAccessTokenResponse,
  InstagramAuthorizeResponse,
  O_AUTH_SERVICE_NAME,
} from '../protos/oauth.pb';
import {
  InstagramAccessTokenRequestDto,
  InstagramAuthorizeRequestDto,
} from './o-auth.dto';
import { OAuthService } from './o-auth.service';

export class OAuthController {
  @Inject(OAuthService)
  private readonly service: OAuthService;

  @GrpcMethod(O_AUTH_SERVICE_NAME, 'instagramAuthorize')
  private instagramAuthorize(
    payload: InstagramAuthorizeRequestDto,
  ): Promise<InstagramAuthorizeResponse> {
    console.log('o-auth-service instagramAuthorize payload: ', payload);
    return this.service.instagramAuthorize(payload);
  }

  @GrpcMethod(O_AUTH_SERVICE_NAME, 'instagramAccessToken')
  private instagramAccessToken(
    payload: InstagramAccessTokenRequestDto,
  ): Promise<InstagramAccessTokenResponse> {
    console.log('o-auth-service instagramAccessToken payload: ', payload);

    return this.service.instagramAccessToken(payload);
  }
}
