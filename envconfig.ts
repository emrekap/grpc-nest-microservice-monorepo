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
const DOCKER_INTERNAL_HOST = 'host.docker.internal';

const PG_ADMIN_DOCKER_HOST_PORT = 1080;
const AUTH_DB_POSTGRES_USER = 'user';
const AUTH_DB_POSTGRES_PASSWORD = 'pass';
const AUTH_DB_POSTGRES_HOST = DOCKER_INTERNAL_HOST;
const AUTH_DB_POSTGRES_DB = 'auth_db';
const AUTH_DB_DOCKER_HOST_PORT = 15432;
const AUTH_SERVICE_DB_URL = `postgresql://${AUTH_DB_POSTGRES_USER}:${AUTH_DB_POSTGRES_PASSWORD}@${AUTH_DB_POSTGRES_HOST}:${AUTH_DB_DOCKER_HOST_PORT}/${AUTH_DB_POSTGRES_DB}?schema=public`;

const APP_FRONTEND_DOCKER_HOST_PORT = 4000;
const API_GATEWAY_HOST_PORT = 3000;
const AUTH_SERVICE_GRPC_PORT = 50051;

const MAILHOG_SMTP_DOCKER_HOST_PORT = 1025;
const MAILHOG_WEB_UI_DOCKER_HOST_PORT = 8025;
const LOCALSTACK_DOCKER_HOST_PORT = 4566;
const LOCALSTACK_WEB_UI_DOCKER_HOST_PORT = 8055;
const RETOOL_WEB_APP_DOCKER_HOST_PORT = 5000;

// if you want to change baseUrl
const NGROK_ENABLE = false;

const APP_BACKEND_BASE_URL = NGROK_ENABLE
  ? `https://ngrok.io`
  : `http://localhost:${API_GATEWAY_HOST_PORT}`;
const APP_FRONTEND_BASE_URL = NGROK_ENABLE
  ? `https://ngrok.io`
  : `http://localhost:${APP_FRONTEND_DOCKER_HOST_PORT}`;

const EXTERNAL_MONOREPO_ROOT = path.join(__dirname);
const GENERATED_DOTENVS = path.join(__dirname, './envgen', './generated');
const SERVICES_DIRECTORY = path.join(__dirname, './services');
const PACKAGES_DIRECTORY = path.join(__dirname, './packages');

export const configs: Config[] = [
  {
    dir: path.join(GENERATED_DOTENVS, 'auth-service-db'),
    filename: '.env.local',
    variables: {
      POSTGRES_USER: AUTH_DB_POSTGRES_USER,
      POSTGRES_PASSWORD: AUTH_DB_POSTGRES_PASSWORD,
      POSTGRES_DB: AUTH_DB_POSTGRES_DB,
      POSTGRES_DB_PORT: AUTH_DB_DOCKER_HOST_PORT,
    },
  },
  {
    dir: path.join(SERVICES_DIRECTORY, 'auth-service'),
    filename: '.env.local',
    variables: {
      AUTH_DB_DOCKER_HOST_PORT: AUTH_DB_DOCKER_HOST_PORT,
      NODE_ENV: 'development',
      DATABASE_URL: AUTH_SERVICE_DB_URL,
    },
  },
  {
    dir: path.join(SERVICES_DIRECTORY, 'auth-service', 'prisma'),
    filename: '.env',
    variables: {
      DATABASE_URL: AUTH_SERVICE_DB_URL,
    },
  },
  {
    dir: path.join(SERVICES_DIRECTORY, 'api-gateway'),
    filename: '.env.local',
    variables: {
      NODE_ENV: 'development',
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
      AUTH_DB_DOCKER_HOST_PORT,
      MAILHOG_SMTP_DOCKER_HOST_PORT,
      MAILHOG_WEB_UI_DOCKER_HOST_PORT,
      LOCALSTACK_DOCKER_HOST_PORT,
      LOCALSTACK_WEB_UI_DOCKER_HOST_PORT,
    },
  },
];
