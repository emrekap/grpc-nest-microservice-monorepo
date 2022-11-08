import { BuiltQueryParamRoute, BuiltRoute } from './RouteBuilder';

type HostId = 'apiGateway' | 'authService';
export type HostMap = Record<HostId, string>;
type RoutesMap = Record<
  string,
  BuiltRoute<any> | BuiltQueryParamRoute<any, any>
>;
type HostIdToRoutesMap = Record<HostId, RoutesMap>;
type ToURLRoutesMap<RM extends RoutesMap> = {
  [K in keyof RM]: RM[K]['__URL_ROUTE'];
};
export type URLRoutesMapOf<HM extends HostIdToRoutesMap> = {
  [K in keyof HM]: HM[K] extends RoutesMap ? ToURLRoutesMap<HM[K]> : never;
};

export const checkHostIdToRoutesMap = <RM extends HostIdToRoutesMap>(
  m: RM,
): RM => m;

export const toURLMap = <HM extends HostIdToRoutesMap>(
  hostRoutesMap: HM,
  hostNameMap: HostMap,
): URLRoutesMapOf<HM> => {
  const result: any = {};
  Object.keys(hostRoutesMap).forEach((hostId) => {
    result[hostId] = {};
  });
  Object.keys(hostRoutesMap).forEach((hostId) => {
    const currentHostRoutes = (<any>hostRoutesMap)[hostId];
    const host = (<any>hostNameMap)[hostId];
    Object.keys(currentHostRoutes).forEach((routeName) => {
      const route = (<any>hostRoutesMap)[hostId][routeName];
      result[hostId][routeName] = route.base(host);
    });
  });
  return result;
};
