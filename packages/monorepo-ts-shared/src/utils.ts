import { Uuid } from './codecs';
import { v4 } from 'uuid';

export interface Class<T> {
  new (args: T): T;
}

export const classMaker = <T extends Record<string, unknown>>(): Class<T> => {
  return class {
    constructor(x: T) {
      Object.assign(this, x);
    }
  } as any;
};

export const uuid = (): Uuid => {
  return v4() as Uuid;
};
