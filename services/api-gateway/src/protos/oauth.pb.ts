/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "oauth";

export interface InstagramAuthorizeRequest {
  clientId: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  state: string;
}

export interface InstagramAuthorizeResponse {
  status: number;
  error: string[];
  user: string;
}

export interface InstagramAccessTokenRequest {
  clientId: string;
  clientSecret: string;
  code: string;
  grantType: string;
  redirectUri: string;
}

export interface InstagramAccessTokenResponse {
  status: number;
  error: string[];
  token: string;
}

export const OAUTH_PACKAGE_NAME = "oauth";

export interface OAuthServiceClient {
  instagramAuthorize(request: InstagramAuthorizeRequest): Observable<InstagramAuthorizeResponse>;

  instagramAccessToken(request: InstagramAccessTokenRequest): Observable<InstagramAccessTokenResponse>;
}

export interface OAuthServiceController {
  instagramAuthorize(
    request: InstagramAuthorizeRequest,
  ): Promise<InstagramAuthorizeResponse> | Observable<InstagramAuthorizeResponse> | InstagramAuthorizeResponse;

  instagramAccessToken(
    request: InstagramAccessTokenRequest,
  ): Promise<InstagramAccessTokenResponse> | Observable<InstagramAccessTokenResponse> | InstagramAccessTokenResponse;
}

export function OAuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["instagramAuthorize", "instagramAccessToken"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OAuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OAuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const O_AUTH_SERVICE_NAME = "OAuthService";
