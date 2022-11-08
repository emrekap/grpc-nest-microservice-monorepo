import * as path from 'path';
import * as dotenv from 'dotenv';
import { v4, validate } from 'uuid';

import { FactoryProvider } from '@nestjs/common';
import * as t from 'io-ts';
import { classMaker, tryDecodeCodec } from '@grpc-monorepo/ts-shared';

const configCodec = t.type({
  NODE_ENV: t.union([
    t.literal('production'),
    t.literal('test'),
    t.literal('development'),
    t.literal('staging'),
  ]),
  DATABASE_URL: t.string,
  APP_BACKEND_BASE_URL: t.string,
});

export const Config = classMaker<t.TypeOf<typeof configCodec>>();
export type Config = InstanceType<typeof Config>;

export const configMock: Config = {
  NODE_ENV: 'test',
  DATABASE_URL: '',
  APP_BACKEND_BASE_URL: '',
};

export function useFactory() {
  try {
    console.log('first');
    if (process.env.LOCAL === 'true') {
      dotenv.config({
        path: path.join(__dirname, '../../.env.local'),
      });
    }
    if (process.env.NODE_ENV === 'test') {
      return configMock;
    }
    console.log(process.env);
    const config = tryDecodeCodec<Config>(configCodec, process.env);

    return config;
  } catch (e) {
    console.log(e);
    throw new Error(`Environment not configured properly.`);
  }
}

export const configFactory: FactoryProvider<Config> = {
  provide: Config,
  useFactory,
};
