import * as path from 'path';
import * as dotenv from 'dotenv';
import { v4, validate } from 'uuid';

import { FactoryProvider } from '@nestjs/common';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types';
import { CustomError } from 'ts-custom-error';

interface Class<T> {
  new (args: T): T;
}

export const classMaker = <T extends Record<string, unknown>>(): Class<T> => {
  return class {
    constructor(x: T) {
      Object.assign(this, x);
    }
  } as any;
};

interface UuidBrand {
  readonly Uuid: unique symbol;
}

export const UuidCodec = t.brand(
  t.string,
  (raw): raw is t.Branded<string, UuidBrand> => {
    return validate(raw);
  },
  'Uuid',
);

export type Uuid = t.TypeOf<typeof UuidCodec>;

export const uuid = (): Uuid => {
  return v4() as Uuid;
};

export class ApiError extends CustomError {
  public readonly id = uuid();
  public readonly internalMessage?: string;
  public readonly externalMessage: string;

  constructor(params: {
    internalMessage?: string; // will be logged internally
    externalMessage: string; // will be relayed to the user
  }) {
    super(params.internalMessage || params.externalMessage);
    this.internalMessage = params.internalMessage;
    this.externalMessage = params.externalMessage;
  }
}

export class CodecError extends ApiError {
  public readonly id = uuid();
  public readonly fields: string[] = [];
  constructor(fields: string[]) {
    super({
      externalMessage: `Bad field: ${fields.join(', ')}`,
    });
    this.fields = fields;
  }
}

export const tryDecodeCodec = <T>(codec: any, data: any) => {
  const decoded = codec.decode(data);
  if (decoded._tag === 'Left') {
    const fields: string[] = [];
    decoded.left.forEach((validationError: any, index: any) => {
      const keysList = validationError.context
        .filter((x) => x.key !== '')
        .map((v: any) => v.key);
      const key = keysList.join(' > ');
      fields.push(key);
      if (process.env.LOCAL === 'true') {
        console.error(`Index: ${index}, Key: ${key}`);
      }
    });
    throw new CodecError(fields);
  }
  return decoded.right as T;
};

export const Config = classMaker<t.TypeOf<typeof configCodec>>();
export type Config = InstanceType<typeof Config>;

export const configMock: Config = {
  NODE_ENV: 'test',
  DATABASE_URL: '',
};

const configCodec = t.type({
  NODE_ENV: t.union([
    t.literal('production'),
    t.literal('test'),
    t.literal('development'),
    t.literal('staging'),
  ]),
  DATABASE_URL: t.string,
});

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
