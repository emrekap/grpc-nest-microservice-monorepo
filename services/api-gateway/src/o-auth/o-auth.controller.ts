import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  InstagramAccessTokenRequest,
  InstagramAccessTokenResponse,
  InstagramAuthorizeRequest,
  InstagramAuthorizeResponse,
  OAuthServiceClient,
  O_AUTH_SERVICE_NAME,
} from '../protos/oauth.pb';

@Controller('o-auth')
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
  private async instagramAccessToken(
    @Body() body: InstagramAccessTokenRequest,
  ): Promise<Observable<InstagramAccessTokenResponse>> {
    return this.svc.instagramAccessToken(body);
  }
}
