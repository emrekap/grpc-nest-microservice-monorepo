import { Config } from './envgen';
import path from 'path';

const DOCKER_INTERNAL_HOST = 'host.docker.internal';

const APP_DB_POSTGRES_USER = 'user';
const APP_DB_POSTGRES_PASSWORD = 'pass';
const APP_DB_POSTGRES_DB = 'url_shortner';
const APP_DB_DOCKER_HOST_PORT = 15435;
const APP_DB_HOST = DOCKER_INTERNAL_HOST;
const APP_DB_INTERNAL_URL = `postgresql://${APP_DB_POSTGRES_USER}:${APP_DB_POSTGRES_PASSWORD}@${APP_DB_HOST}:${APP_DB_DOCKER_HOST_PORT}/${APP_DB_POSTGRES_DB}?schema=public`;

const BASE_URL = 'http://localhost:4005/'; // 'https://tier.app/';
const DEFAULT_REDIRECT_URL = 'https://tier.app';
const PORT = 4005;

export const configs: Config[] = [
  {
    dir: path.join(__dirname, '../../../env'),
    filename: '.app.env.local',
    variables: {
      NODE_ENV: 'development',
      DATABASE_URL: APP_DB_INTERNAL_URL,
      BASE_URL,
      DEFAULT_REDIRECT_URL,
      PORT,
    },
  },
  {
    dir: path.join(__dirname, '../../../env'),
    filename: '.db.env.local',
    variables: {
      POSTGRES_USER: APP_DB_POSTGRES_USER,
      POSTGRES_PASSWORD: APP_DB_POSTGRES_PASSWORD,
      POSTGRES_DB: APP_DB_POSTGRES_DB,
      POSTGRES_DB_PORT: APP_DB_DOCKER_HOST_PORT,
    },
  },
  {
    dir: path.join(__dirname, '../../..'),
    filename: '.env',
    variables: {
      PORT,
      APP_DB_DOCKER_HOST_PORT: APP_DB_DOCKER_HOST_PORT,
      DOCKER_HOST_IP: DOCKER_INTERNAL_HOST,
      DATABASE_URL: APP_DB_INTERNAL_URL,
    },
  },
];
