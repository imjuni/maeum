import config from '@config/config';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import route from '@handler/route';
import logging from '@logger/bootstrap';
import {
  fileuploadCase01,
  fileuploadCase02,
  fileuploadCase03,
  fileuploadCase04,
  fileUploadSchemaId,
} from '@server/fileupload';
import optionFactory from '@server/module/optionFactory';
import onHookGlobalError from '@server/plugin/onHookGlobalError';
import onHookResponse from '@server/plugin/onHookResponse';
import responeTime from '@server/plugin/responseTime';
import swaggerConfig from '@server/plugin/swaggerConfig';
import fastify, { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import httpStatusCodes from 'http-status-codes';
import { isNotEmpty } from 'my-easy-fp';

const log = logging(__filename);

let server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

export async function bootstrap(): Promise<FastifyInstance> {
  const option = optionFactory();

  server = fastify(option);

  server.register(responeTime);
  server.register(fastifyCors);

  await server.register(fastifySwagger, swaggerConfig());
  await server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    sharedSchemaId: fileUploadSchemaId,
  });

  server.setErrorHandler(onHookGlobalError);
  server.addHook('onResponse', onHookResponse);

  route(server);

  fileuploadCase01(server);
  fileuploadCase02(server);
  fileuploadCase03(server);
  fileuploadCase04(server);

  return server;
}

export async function unbootstrap() {
  await server.close();
}

export function listen(port: number): void {
  log.info({
    status: httpStatusCodes.OK,
    duration: -1,
    req_method: 'SYS',
    req_url: `server/start/port:${port}/pid:${process.pid}`,
    body: {
      port,
      run_mode: config.server.runMode,
    },
  });

  server.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (isNotEmpty(err)) {
      log.crit({
        status: httpStatusCodes.INTERNAL_SERVER_ERROR,
        duration: -1,
        req_method: 'SYS',
        req_url: `server/start/port:${port}/pid:${process.pid}`,
        err_msg: err.message,
        err_stk: err.stack,
        body: {
          port,
          run_mode: config.server.runMode,
          address,
        },
      });

      throw err;
    }

    log.info({
      status: httpStatusCodes.OK,
      duration: -1,
      req_method: 'SYS',
      req_url: `localhost:${port}/${process.pid}/start`,
      body: {
        port,
        run_mode: config.server.runMode,
        address,
      },
    });

    log.trace(`Server start: [${port}:] localhost:${port}-${process.pid}/start`);

    // for pm2
    if (process.send != null) {
      process.send('ready');
    }
  });
}
