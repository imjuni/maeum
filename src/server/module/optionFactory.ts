import ajv, { ajvOptions } from '@config/ajv';
import { addSchema, plainJsonSchema } from '@config/json-schema';
import fastJsonStringify, { Options as FJSOptions } from 'fast-json-stringify';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { JSONSchema7 } from 'json-schema';
import { ReadonlyDeep } from 'type-fest';

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
    serverFactory: httpServerFactory,
  };

  const server = fastify<Server, IncomingMessage, ServerResponse>({
    ...option,
    schemaController: {
      bucket: (_parentSchemas?: JSONSchema7) => {
        return {
          add(schema: JSONSchema7): FastifyInstance<Server, IncomingMessage, ServerResponse> {
            addSchema(schema);
            return server;
          },
          getSchema(schemaId: string) {
            return plainJsonSchema[schemaId];
          },
          getSchemas(): ReadonlyDeep<Record<string, JSONSchema7>> {
            return plainJsonSchema;
          },
        };
      },
      compilersFactory: {
        buildValidator() {
          return ({ schema }) => ajv.compile(schema);
        },
        buildSerializer(externalSchemas: FJSOptions['schema'], options: FJSOptions) {
          return ({ schema }) => {
            const fjsoption = options ?? {};

            fjsoption.schema = externalSchemas;
            fjsoption.ajv = ajvOptions;

            const stringify = fastJsonStringify(schema, fjsoption);
            return (data: unknown) => stringify(data);
          };
        },
      },
    },
  });

  return { fastify: server, option };
}
