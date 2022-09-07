import ajvFormats from 'ajv-formats';
import { FastifyServerOptions } from 'fastify';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

type THttpServerFactory = (
  handler: (req: IncomingMessage, res: ServerResponse) => void,
  _option: FastifyServerOptions,
) => Server;

/**
 * HTTP serverFactory
 */
function httpServerFactory(handler: (req: IncomingMessage, res: ServerResponse) => void): Server {
  const newServer = createServer((req, res) => handler(req, res));
  newServer.keepAliveTimeout = 120 * 100;
  return newServer;
}

export default function optionFactory() {
  const option: FastifyServerOptions & { serverFactory: THttpServerFactory } = {
    ignoreTrailingSlash: true,
    ajv: {
      customOptions: {
        coerceTypes: 'array',
        keywords: ['collectionFormat', 'example', 'binary'],
      },
      plugins: [ajvFormats],
    },
    serverFactory: httpServerFactory,
  };

  return option;
}
