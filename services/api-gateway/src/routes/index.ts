import { finalizeRoutes } from '@grpc-monorepo/routes';
import { useFactory } from '../config/config-factory';

export const routes = (() => {
  // this is a hack that we have to use because
  // we need the config values before we can
  // dependency inject the config object.
  // this is a one-time anti-pattern that should not
  // be repeated. we should only depend on the injected
  // config object through class contsructors.
  const config = useFactory();

  return finalizeRoutes({
    apiGatewayBaseUrl: config.APP_BACKEND_BASE_URL,
  });
})();
