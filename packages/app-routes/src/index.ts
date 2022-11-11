import { checkHostIdToRoutesMap, HostMap, toURLMap } from './helpers';
import { route } from './RouteBuilder';

// This is an object where each key is a unique reference to a host within our control.
// Each value is yet another object where each key is a unique assigned to a route within
// the host, and each value is a comprehensive route object that exposes various methods.

// They are called baseRoutes because they aren't fully realized. In order to allow different
// environments to build different urls through a shared route structure, we're decoupling url
// builders from route builders. This map can be combined with a host map (a map that pairs
// each unique host id with the actual host value) and create a final map that can not only
// expose routes logic, but also url building logic. This is done via finalizeRoutes().

const authServiceBase = route().segment('auth');
const instagramOAuthServiceBase = route().segment('oauth').segment('instagram');

const baseRoutes = checkHostIdToRoutesMap({
  apiGateway: { healthCheck: route().segment('health').build() },
  authService: {
    login: authServiceBase.segment('login').build(),
    register: authServiceBase.segment('register').build(),
    validate: authServiceBase.segment('validate').build(),
  },
  oAuthService: {
    instagramAuthorize: instagramOAuthServiceBase.segment('authorize').build(),
    instagramAccessToken: instagramOAuthServiceBase
      .segment('accessToken')
      .build(),
  },
});

export const finalizeRoutes = ({
  apiGatewayBaseUrl,
}: {
  apiGatewayBaseUrl: string;
}) => {
  const hostMap: HostMap = {
    apiGateway: apiGatewayBaseUrl,
  };
  return toURLMap(baseRoutes, hostMap);
};
