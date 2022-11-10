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

@Controller('o-auth')
export class OAuthController {
  @Inject(OAuthService)
  private readonly service: OAuthService;

  @GrpcMethod(O_AUTH_SERVICE_NAME, 'instagramAuthorize')
  private instagramAuthorize(
    payload: InstagramAuthorizeRequestDto,
  ): Promise<InstagramAuthorizeResponse> {
    return this.service.instagramAuthorize(payload);
  }

  @GrpcMethod(O_AUTH_SERVICE_NAME, 'instagramAccessToken')
  private instagramAccessToken(
    payload: InstagramAccessTokenRequestDto,
  ): Promise<InstagramAccessTokenResponse> {
    return this.service.instagramAccessToken(payload);
  }
}
