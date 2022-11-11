import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

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
      console.log('data: ', data);
      return { status, error: null };
    } catch (error) {
      // const { status, statusText } = error.response;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        console.log(response);
        return {
          status: response.status,
          error: [JSON.stringify(response.data)],
        };
      }
      return { status: 500, error: [JSON.stringify(error)] };
    }
  }

  public async instagramAccessToken(
    params: InstagramAccessTokenRequestDto,
  ): Promise<InstagramAccessTokenResponse> {
    const { clientId, clientSecret, code, grantType, redirectUri } = params;
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<InstagramAccessTokenResponse>(
          'https://api.instagram.com/oauth/access_token',
          JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: grantType,
            redirect_uri: redirectUri,
          }),
        ),
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { response } = error;
        console.log(response);
        console.log(code);
        return {
          status: response.status,
          token: '',
          error: [JSON.stringify(response.data)],
        };
      }
      // const { status, statusText } = error.response;
      return { status: 500, token: '', error: [JSON.stringify(error)] };
    }
  }
}
