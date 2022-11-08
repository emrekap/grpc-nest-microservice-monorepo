import * as t from 'io-ts';
import { validate } from 'uuid';
import { CodecError } from './errors';

export interface UuidBrand {
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

export const tryDecodeCodec = <T>(codec: any, data: any) => {
  const decoded = codec.decode(data);
  if (decoded._tag === 'Left') {
    const fields: string[] = [];
    decoded.left.forEach((validationError: any, index: any) => {
      const keysList = validationError.context
        .filter((x: any) => x.key !== '')
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
