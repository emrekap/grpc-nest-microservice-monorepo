import { string } from 'fp-ts';
import * as t from 'io-ts';
import { BooleanFromString } from 'io-ts-types';
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

const appFrontend = route().segment('app');
const shopifyProductWebhookBase = route().segment('shopify').segment('product');
const shopifyOrderFulfillmentWebhookBase = route()
  .segment('shopify')
  .segment('fulfillment');
const appCredentials = appFrontend.segment('credentials');

const baseRoutes = checkHostIdToRoutesMap({
  appBackend: {
    healthCheck: route().segment('health').build(),
    inboundEmailWebhook: route()
      .segment('webhooks')
      .segment('email')
      .segment('inbound')
      .build(),
    shopifyProductCreateWebhook: shopifyProductWebhookBase
      .segment('create')
      .build(),
    shopifyProductUpdateWebhook: shopifyProductWebhookBase
      .segment('update')
      .build(),
    shopifyProductDeleteWebhook: shopifyProductWebhookBase
      .segment('delete')
      .build(),
    shopifyIngestProductCatalog: shopifyProductWebhookBase
      .segment('ingest')
      .param('brandId')
      .build(),
    shopifyOrderFulfillmentCreateWebhook: shopifyOrderFulfillmentWebhookBase
      .segment('create')
      .build(),
    shopifyOrderFulfillmentUpdateWebhook: shopifyOrderFulfillmentWebhookBase
      .segment('update')
      .build(),
  },
  appFrontend: {
    logIn: appFrontend.segment('login').build(),
    signUp: appFrontend.segment('signup').build(),
    about: route().segment('about').build(),
    careers: route().segment('careers').build(),
    faq: route().segment('faq').build(),
    tos: route().segment('tos').build(),
    owners: route().segment('owners').build(),
    brands: route().segment('brands').build(),
    blog: route().segment('blog').build(),

    root: route().build(),
    privacy: route().segment('privacy').build(),
    tokenAuth: appFrontend
      .segment('auth')
      .segment('token')
      .build()
      .queryParamsU(
        {
          type: t.literal('signup'),
          token: t.string,
        },
        {
          type: t.literal('login'),
          token: t.string,
        },
      ),
    receiptDetail: appFrontend.segment('receipt').param('receiptId').build(),
    myWallet: appFrontend.segment('wallet').build(),
    gmailOauth: appFrontend
      .segment('auth')
      .segment('gmail')
      .build()
      .queryParams({
        code: t.string,
      }),
    authResult: appFrontend.segment('auth').build().queryParams({
      success: BooleanFromString,
      email: t.string,
      source: t.string, // TODO: 'signin' | 'signup'
      name: t.string,
    }),
    instagramOAuthCallback: appFrontend
      .segment('connect')
      .segment('instagram')
      .build(),
    settings: appFrontend.segment('profile').segment('settings').build(),
    deleteAccount: appFrontend
      .segment('profile')
      .segment('delete-account')
      .build()
      .queryParams({
        token: t.string,
      }),
    requestDeleteAccount: appFrontend
      .segment('profile')
      .segment('request-delete-account')
      .build()
      .queryParams({
        email: t.string,
      }),
    credential: appCredentials.param('credentialId', t.string).build(),
    credentialOnboarding: appCredentials
      .param('credentialId', t.string)
      .segment('onboarding')
      .build(),
    explore: appFrontend.segment('explore').build(),
    nyfashionweek: appFrontend.segment('nyfashionweek').build(),
    unAuthExplore: route().segment('explore').build(),
  },
  appBlog: {
    blog: route().build(),
  },
});

export const finalizeRoutes = ({
  appBackendBaseURL,
  appFrontendBaseURL,
  appBlogBaseUrl,
}: {
  appBackendBaseURL: string;
  appFrontendBaseURL: string;
  appBlogBaseUrl: string;
}) => {
  const hostMap: HostMap = {
    appBackend: appBackendBaseURL,
    appFrontend: appFrontendBaseURL,
    appBlog: appBlogBaseUrl,
  };
  return toURLMap(baseRoutes, hostMap);
};
