import config from '@config/config';
import logging from '@logger/bootstrap';
import { ILogFormat } from '@logger/interface/ILogFormat';
import getHttpMethod from '@logger/module/getHttpMethod';
import httplog from '@logger/module/httplog';
import escape from '@tool/misc/escape';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';
import { createByfastify3 } from 'jin-curlize';
import { isError } from 'my-easy-fp';

const log = logging(__filename);

const skipEndpointPrefix = ['/health', '/', '/swagger.io/static/index.css'].reduce<
  Record<string, boolean>
>((aggregation, url) => ({ ...aggregation, [url]: true }), {});

function create(req: FastifyRequest): string | undefined {
  try {
    // recommand prettify option enable only local run-mode because newline character possible to broken log
    const command =
      config.server.runMode !== 'production'
        ? createByfastify3(req, { prettify: false, uuid: { command: 'uuidgen', paramName: 'tid' } })
        : createByfastify3(req, { prettify: false });

    return command === '' ? undefined : command;
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error(`unknown error raised from ${__filename}`);

    log.trace(err.message);
    log.trace(err.stack);

    return undefined;
  }
}

export default function httpLogging(
  req: FastifyRequest,
  reply: FastifyReply,
  err?: Error,
  level?: keyof ReturnType<typeof logging>,
) {
  try {
    // 로깅을 하지 않는 경우를 파악하기 위해서 검사를 한 번 한다
    if (skipEndpointPrefix[req.raw.url ?? '']) {
      return true;
    }

    const { duration, headers, queries, params, body } = httplog(req, reply);

    const contents: ILogFormat = {
      status: reply.raw.statusCode,
      req_method: getHttpMethod(req.raw.method),
      duration,
      req_url: req.raw.url ?? '/http/logging/unknown',
      curl_cmd: create(req),
      err_msg: err !== undefined && err !== null ? escape(err.message) : undefined,
      err_stk: err !== undefined && err !== null ? escape(err.stack ?? '') : undefined,
      body: {
        req_http_version: req.raw.httpVersion,
        // sys_instance_id: instance.info.instanceID,
        // sys_env_id: instance.info.envID,
        // sys_ami: instance.info.amiID,
        ...headers,
        ...queries,
        ...params,
        ...body,
      },
    };

    if (reply.statusCode >= 400) {
      log.trace('catch exception: ', err);
      log.trace(contents);
    }

    if (level === undefined || level === null) {
      log.info(contents);
    } else {
      log[level](contents);
    }

    return true;
  } catch (catched) {
    const catchedError = isError(catched) ?? new Error(`unknown error raised from ${__filename}`);

    log.error({
      err: catchedError,
      curl_cmd: create(req),
      req_method: 'SYS',
      req_url: req.raw.url ?? 'error/response/hook',
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    });

    return false;
  }
}
