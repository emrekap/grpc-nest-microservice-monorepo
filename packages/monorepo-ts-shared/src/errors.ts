import { CustomError } from 'ts-custom-error';
import { uuid } from './utils';

export class ApiError extends CustomError {
  public readonly id = uuid() as string;
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
  public readonly id = uuid() as string;
  public readonly fields: string[] = [];
  constructor(fields: string[]) {
    super({
      externalMessage: `Bad field: ${fields.join(', ')}`,
    });
    this.fields = fields;
  }
}
