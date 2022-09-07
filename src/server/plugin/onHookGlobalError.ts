import logging from '@logger/bootstrap';
import httpLogging from '@logger/httpLogging';
import IRestError from '@module/http/IRestError';
import RestError from '@module/http/RestError';
import getLocales from '@tool/i18n/getLocales';
import { ErrorObject } from 'ajv';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';

const log = logging(__filename);

export default function onHookGlobalError(
  err: Error & { validation?: ErrorObject[] },
  req: FastifyRequest,
  reply: FastifyReply,
): void {
  if (err.validation !== undefined) {
    const replyMessage = err.validation
      .map(
        (validationError) =>
          `${validationError.message}\n${validationError.instancePath}\n${validationError.data}\n`,
      )
      .join('--\n');

    const polyglot = getLocales(req.headers['accept-language']);
    const body: IRestError = {
      code: '85dc84e951a84bf48a35ab5665998b63',
      message: `${polyglot.t('common.main.bad_request', {
        allowMissing: true,
      })}\n\n${replyMessage}`,
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    };

    log.trace(
      '>> [onHookGlobalError 404] ------------------------------------------------------------',
    );
    log.trace(err.message);
    log.trace(err.stack);
    log.trace(replyMessage);
    log.trace(
      '>>>>> ---------------------------------------------------------------------------------',
    );

    reply.status(httpStatusCodes.BAD_REQUEST).send(body);
    httpLogging(req, reply, err);

    return;
  }

  if (isError(err) && err instanceof RestError) {
    const body: IRestError = {
      code: err.code,
      message: err.message,
      payload: err.payload,
      status: err.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR,
    };

    reply.status(err.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR).send(body);
  }

  const polyglot = getLocales(req.headers['accept-language']);
  const body: IRestError = {
    code: '88a417dad2bd4f0ba4540b7ffabf3e5d',
    message: polyglot.t('common.main.error', { allowMissing: true }),
    status: httpStatusCodes.INTERNAL_SERVER_ERROR,
  };

  log.trace(
    '>> [onHookGlobalError 500] ------------------------------------------------------------',
  );
  log.trace(err.message);
  log.trace(err.stack);
  log.trace(
    '>>>>> ---------------------------------------------------------------------------------',
  );

  reply.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(body);
  httpLogging(req, reply, err);
}
