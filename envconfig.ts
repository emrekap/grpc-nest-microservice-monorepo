import path from 'path';
import { Config } from './envgen/types';

/**
 * This file is the central hub for all dotenv files we're using in our monorepo.
 * All of this is strictly for the dev environment.
 * You can declare constants and reuse them in various ways to be exposed via .env files.
 *
 *
 * IMPORTANT: Once you make your changes, run `npm run envgen` to regenerate the .env files.
 */

const PG_ADMIN_DOCKER_HOST_PORT = 1080;
const APP_DB_POSTGRES_USER = 'user';
const APP_DB_POSTGRES_PASSWORD = 'pass';
const APP_DB_POSTGRES_DB = 'appreciate';
const RETOOL_POSTGRES_DB = 'retool';
const APP_DB_DOCKER_HOST_PORT = 15432;
const DOCKER_INTERNAL_HOST = 'host.docker.internal';
const APP_DB_HOST = DOCKER_INTERNAL_HOST;
const APP_DB_INTERNAL_URL = `postgresql://${APP_DB_POSTGRES_USER}:${APP_DB_POSTGRES_PASSWORD}@${APP_DB_HOST}:${APP_DB_DOCKER_HOST_PORT}/${APP_DB_POSTGRES_DB}?schema=public`;
const NESTJS_APP_BACKEND_DOCKER_HOST_PORT = 4000;
const NEXTJS_APP_FRONTEND_DOCKER_HOST_PORT = 3000;
const MAILHOG_SMTP_DOCKER_HOST_PORT = 1025;
const MAILHOG_WEB_UI_DOCKER_HOST_PORT = 8025;
const LOCALSTACK_DOCKER_HOST_PORT = 4566;
const LOCALSTACK_WEB_UI_DOCKER_HOST_PORT = 8055;
const RETOOL_WEB_APP_DOCKER_HOST_PORT = 5000;

// if you want to change baseUrl
const NGROK_ENABLE = false;

const APP_BACKEND_BASE_URL = NGROK_ENABLE
  ? `https://appreciate.us.ngrok.io`
  : `http://localhost:${NESTJS_APP_BACKEND_DOCKER_HOST_PORT}`;
const APP_FRONTEND_BASE_URL = NGROK_ENABLE
  ? `https://appreciate.front.us.ngrok.io`
  : `http://localhost:${NEXTJS_APP_FRONTEND_DOCKER_HOST_PORT}`;

const APP_BLOG_BASE_URL = `https://blog.appreciate.it`;
const INFURA_PROJECT_ID = '5634b72db78f442a9b20bb1bf4575e8e';

const EXTERNAL_MONOREPO_ROOT = path.join(__dirname);
const GENERATED_DOTENVS = path.join(__dirname, './envgen', './generated');
const SERVICES_DIRECTORY = path.join(__dirname, './services');
const PACKAGES_DIRECTORY = path.join(__dirname, './packages');

const CLOUDINARY_API_KEY = '888314817349995';
const CLOUDINARY_SECRET_KEY = 'cloudinary-secret-key';
const CLOUDINARY_UPLOAD_TYPE = 'local';

const CLOUDINARY_CLOUD_NAME = 'appreciate-stuff-inc';
const CLOUDINARY_USER_PHOTO_UPLOAD_PRESET = 'dev-user-uploads';

const INSTAGRAM_APP_ID = '957737058189787';
const INSTAGRAM_APP_SECRET = 'instagram-app-secret';

const GOOGLE_APPLICATION_CREDENTIALS = './automl.json';

export const configs: Config[] = [
  {
    dir: path.join(GENERATED_DOTENVS, 'auth-service-db'),
    filename: '.env.local',
    variables: {
      POSTGRES_USER: APP_DB_POSTGRES_USER,
      POSTGRES_PASSWORD: APP_DB_POSTGRES_PASSWORD,
      POSTGRES_DB: APP_DB_POSTGRES_DB,
      POSTGRES_DB_PORT: APP_DB_DOCKER_HOST_PORT,
    },
  },
  {
    dir: path.join(GENERATED_DOTENVS, 'pgadmin'),
    filename: '.env.local',
    variables: {
      POSTGRES_USER: APP_DB_POSTGRES_USER,
      POSTGRES_PASSWORD: APP_DB_POSTGRES_PASSWORD,
      POSTGRES_DB: APP_DB_POSTGRES_DB,
      PGADMIN_DEFAULT_EMAIL: 'admin@admin.com',
      PGADMIN_DEFAULT_PASSWORD: 'admin',
    },
  },
  {
    dir: path.join(GENERATED_DOTENVS, 'retool'),
    filename: '.env.local',
    variables: {
      STAGE: 'local',
      POSTGRES_USER: APP_DB_POSTGRES_USER,
      POSTGRES_PASSWORD: APP_DB_POSTGRES_PASSWORD,
      POSTGRES_DB: RETOOL_POSTGRES_DB,
      POSTGRES_PORT: APP_DB_DOCKER_HOST_PORT,
      POSTGRES_HOST: DOCKER_INTERNAL_HOST,
      JWT_SECRET: 'backoffice-jwt-key',
      LICENSE_KEY: 'backoffice-license-key',
      ENCRYPTION_KEY: 'backoffice-enc-key',
      COOKIE_INSECURE: true,
    },
  },
  {
    dir: path.join(SERVICES_DIRECTORY, 'nestjs-app-backend'),
    filename: '.env.local',
    variables: {
      DATABASE_URL: APP_DB_INTERNAL_URL,
      PORT: NESTJS_APP_BACKEND_DOCKER_HOST_PORT,
      DEVELOPER_ENDPOINTS_ENABLED: true,
      EMAIL_TRANSPORT: JSON.stringify({
        HOST: DOCKER_INTERNAL_HOST,
        TYPE: 'local',
        PORT: MAILHOG_SMTP_DOCKER_HOST_PORT,
      }),
      CLOUDINARY_API_KEY,
      CLOUDINARY_SECRET_KEY,
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_TYPE,
      CLOUDINARY_USER_PHOTO_UPLOAD_PRESET,
      GRAPHQL_SETTINGS: JSON.stringify({
        DEBUG: true,
        INTROSPECTION: true,
      }),
      EMAIL_DEFAULT_FROM: 'notifications@appreciate.it',
      EMAIL_DEFAULT_REPLY_TO: 'notifications@appreciate.it',
      JWT_SECRET: 'development-jwt-secret',
      HTTP_COOKIE_SECRET: 'http-cookie-secret',
      ALLOW_TRUNCATE: true,
      APP_BACKEND_BASE_URL,
      APP_FRONTEND_BASE_URL,
      APP_BLOG_BASE_URL,
      NODE_ENV: 'development',
      INSTAGRAM_APP_ID,
      INSTAGRAM_APP_SECRET,
      SHOPIFY_APP_API_KEY: '4a18c8c3556fe39793770a09cb8adaaa',
      SHOPIFY_APP_SECRET: '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',
      SHOPIFY_APP_HOSTNAME: 'appreciate.webhook.us.ngrok.io',
      VC_CONFIG: JSON.stringify({
        INFURA_PROJECT_ID,
        INFURA_SECRET: 'f5fad82b38314ce3bd0f5f8e1b52cd18',
        IPFS_PROJECT_ID: '27dzJ2GqHiORraUjXmnb7umV9y2',
        IPFS_PROJECT_SECRET: 'b210dce537d16db7db231d36e8d584c6',
        NETWORK: '0x1',
        PRIVATE_KEY:
          'a8b595680851765f38ea5405159244ba3cbad84467d190459f4c8b20c1ffec75',
        REGISTRY_ADDRESS: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
        RPC_URL: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
        RPC_WEB_SOCKET: `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
      }),
      GOOGLE_APPLICATION_CREDENTIALS,
      GMAIL_OAUTH_CLIENT_SECRET: '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',
      GMAIL_OAUTH_REDIRECT_URI:
        'https://appreciate.front.us.ngrok.io/app/auth/gmail',
      GMAIL_OAUTH_CLIENT_ID:
        '147644986513-05c084uum2ptt5g3ktvvq1o5ila8099f.apps.googleusercontent.com',
    },
  },
  {
    dir: path.join(PACKAGES_DIRECTORY, 'db'),
    filename: '.env',
    variables: {
      DATABASE_URL: APP_DB_INTERNAL_URL,
    },
  },
  {
    /**
     * These will be placed on the root of the monorepo (/appreciate-monorpo/.env).
     * They aren't needed inside any of our apps or services, but rather in the
     * docker-compose.yml file in the root folder. This helps keep the docker setup DRY
     * and enables us to reuse various environment variables.
     */
    dir: EXTERNAL_MONOREPO_ROOT,
    filename: '.env',
    variables: {
      APP_DB_DOCKER_HOST_PORT,
      MAILHOG_SMTP_DOCKER_HOST_PORT,
      MAILHOG_WEB_UI_DOCKER_HOST_PORT,
      PG_ADMIN_DOCKER_HOST_PORT,
      LOCALSTACK_DOCKER_HOST_PORT,
      LOCALSTACK_WEB_UI_DOCKER_HOST_PORT,
      WEB_APP_DOCKER_HOST_PORT: RETOOL_WEB_APP_DOCKER_HOST_PORT,
    },
  },
];
