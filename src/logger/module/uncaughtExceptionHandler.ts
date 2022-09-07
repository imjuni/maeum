import logging from '@logger/bootstrap';
import safeStringify from '@tool/misc/safeStringify';
import httpStatusCodes from 'http-status-codes';
import { isEmpty } from 'my-easy-fp';

const log = logging(__filename);

export default function bootstrap() {
  process.on('uncaughtException', (err) => {
    log.trace('uncaughtException: ', err.message);
    log.trace('uncaughtException: ', err.stack);

    log.crit({
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      req_method: 'SYS',
      req_url: 'uncaughtException',
      err,
    });
  });

  process.on('unhandledRejection', (reason) => {
    log.trace('unhandledRejection: ', reason);

    const message = isEmpty(reason)
      ? `unknown error by [unhandledRejection] / ${reason}`
      : safeStringify(reason);

    log.crit({
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      req_method: 'SYS',
      req_url: 'unhandledRejection',
      err: new Error(message),
    });
  });
}
