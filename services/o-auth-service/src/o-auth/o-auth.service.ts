import { Injectable } from '@nestjs/common';
import {
  InstagramAccessTokenResponse,
  InstagramAuthorizeResponse,
} from 'src/protos/oauth.pb';
import {
  InstagramAccessTokenRequestDto,
  InstagramAuthorizeRequestDto,
} from './o-auth.dto';

@Injectable()
export class OAuthService {
  public async instagramAuthorize({}: InstagramAuthorizeRequestDto): Promise<InstagramAuthorizeResponse> {
    return;
  }

  public async instagramAccessToken({}: InstagramAccessTokenRequestDto): Promise<InstagramAccessTokenResponse> {
    return;
  }
}
