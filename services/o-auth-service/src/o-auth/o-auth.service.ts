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
    return { status: 200, user: '', error: null };
  }

  public async instagramAccessToken({}: InstagramAccessTokenRequestDto): Promise<InstagramAccessTokenResponse> {
    return { status: 200, token: '', error: null };
  }
}
