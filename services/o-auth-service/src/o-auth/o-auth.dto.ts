import { IsNotEmpty, IsNumberString, IsString, IsUrl } from 'class-validator';
import {
  InstagramAccessTokenRequest,
  InstagramAuthorizeRequest,
} from 'src/protos/oauth.pb';

export class InstagramAuthorizeRequestDto implements InstagramAuthorizeRequest {
  @IsNotEmpty()
  @IsNumberString()
  clientId: string;

  @IsUrl()
  @IsNotEmpty()
  redirectUri: string;

  @IsNotEmpty()
  responseType: string;

  @IsString()
  scope: string;

  state: string;
}

export class InstagramAccessTokenRequestDto
  implements InstagramAccessTokenRequest
{
  @IsNotEmpty()
  @IsNumberString()
  clientId: string;

  @IsNotEmpty()
  clientSecret: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  grantType: string;

  @IsUrl()
  @IsNotEmpty()
  redirectUri: string;
}
