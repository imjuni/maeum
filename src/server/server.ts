import config from '@config/config';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import route from '@handler/route';
import logging from '@logger/bootstrap';
import addServerSchema from '@server/module/addServerSchema';
import onHookGlobalError from '@server/plugin/onHookGlobalError';
import onHookResponse from '@server/plugin/onHookResponse';
import responeTime from '@server/plugin/responseTime';
import swaggerConfig from '@server/plugin/swaggerConfig';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import httpStatusCodes from 'http-status-codes';
import { isNotEmpty } from 'my-easy-fp';

const log = logging(__filename);

type THttpServerFactory = (
  handler: (req: IncomingMessage, res: ServerResponse) => void,
  _option: FastifyServerOptions,
) => Server;

let server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

/**
 * HTTP serverFactory
 */
function httpServerFactory(handler: (req: IncomingMessage, res: ServerResponse) => void): Server {
  const newServer = createServer((req, res) => handler(req, res));
  newServer.keepAliveTimeout = 120 * 100;
  return newServer;
}

export async function bootstrap(): Promise<FastifyInstance> {
  const option: FastifyServerOptions & { serverFactory: THttpServerFactory } = {
    ignoreTrailingSlash: true,
    serverFactory: httpServerFactory,
  };

  server = fastify(option);

  server.register(responeTime);
  server.register(fastifyCors);
  await server.register(fastifySwagger, swaggerConfig());

  server.setErrorHandler(onHookGlobalError);
  server.addHook('onResponse', onHookResponse);

  await addServerSchema(server);

  route(server);

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

    log.$(`Server start: [${port}:] localhost:${port}-${process.pid}/start`);

    // for pm2
    // if (isNotEmpty(process.send)) {
    //   process.send('ready');
    // }
  });
}
