import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  InstagramAccessTokenResponse,
  InstagramAuthorizeResponse,
} from '../protos/oauth.pb';
import {
  InstagramAccessTokenRequestDto,
  InstagramAuthorizeRequestDto,
} from './o-auth.dto';

@Injectable()
export class OAuthService {
  constructor(private httpService: HttpService) {}

  public async instagramAuthorize(
    params: InstagramAuthorizeRequestDto,
  ): Promise<InstagramAuthorizeResponse> {
    try {
      const queryParams = `?cliend_id=${params.clientId}&redirect_uri=${params.redirectUri}&response_type=${params.responseType}`;
      const { data, status } = await firstValueFrom(
        this.httpService.get<InstagramAuthorizeResponse>(
          `https://api.instagram.com/oauth/authorize${queryParams}`,
        ),
      );
      return { status, user: JSON.stringify(data), error: null };
    } catch (error) {
      // const { status, statusText } = error.response;

      return { status: 500, user: '', error: [JSON.stringify(error)] };
    }
  }

  public async instagramAccessToken(
    params: InstagramAccessTokenRequestDto,
  ): Promise<InstagramAccessTokenResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<InstagramAccessTokenResponse>(
          'https://api.instagram.com/oauth/access_token',
          {
            data: params,
          },
        ),
      );
      return response.data;
    } catch (error) {
      // const { status, statusText } = error.response;
      return { status: 500, token: '', error: [JSON.stringify(error)] };
    }
  }
}
