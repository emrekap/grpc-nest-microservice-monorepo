import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { routes } from '../routes';
import { AuthGuard } from '../auth/auth.guard';
import {
  InstagramAccessTokenRequest,
  InstagramAccessTokenResponse,
  InstagramAuthorizeRequest,
  InstagramAuthorizeResponse,
  OAuthServiceClient,
  O_AUTH_SERVICE_NAME,
} from '../protos/oauth.pb';

@Controller('oauth')
export class OAuthController implements OnModuleInit {
  private svc: OAuthServiceClient;

  @Inject(O_AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<OAuthServiceClient>(O_AUTH_SERVICE_NAME);
  }

  @Get('instagram/authorize')
  private async instagramAuthorize(
    @Query() query: InstagramAuthorizeRequest,
  ): Promise<Observable<InstagramAuthorizeResponse>> {
    console.log(query);
    return this.svc.instagramAuthorize(query);
  }

  @Get('instagram/accessToken')
  // @UseGuards(AuthGuard)
  private async instagramAccessToken(
    @Query() query: InstagramAccessTokenRequest,
  ): Promise<Observable<InstagramAccessTokenResponse>> {
    return this.svc.instagramAccessToken(query);
  }
}
