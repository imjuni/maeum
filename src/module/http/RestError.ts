import IRestError from '@module/http/IRestError';
import httpStatusCodes from 'http-status-codes';

export default class RestError<T> extends Error implements IRestError {
  code: string;

  message: string;

  payload?: T;

  status: number;

  constructor({
    code,
    message,
    payload,
    status,
  }: Omit<IRestError, 'status'> & { status?: number }) {
    super(message);

    this.code = code;
    this.payload = payload;
    this.message = message;
    this.status = status ?? httpStatusCodes.INTERNAL_SERVER_ERROR;
  }
}
