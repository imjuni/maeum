/* eslint-disable @typescript-eslint/naming-convention */
import 'fastify';

declare module 'fastify' {
  import { JTDDataType, Options, ValidateFunction } from 'ajv';
  import { Options as FJSOptions } from 'fast-json-stringify';
  import { FastifyLoggerInstance, FastifyServerOptions, RawServerDefault } from 'fastify';
  import http from 'http';
  import { JSONSchema7 } from 'json-schema';

  export type FastifyServerSchemaControllerOptions<
    RawServer extends RawServerBase = RawServerDefault,
    Logger extends FastifyBaseLogger = FastifyLoggerInstance,
  > = Omit<FastifyServerOptions<RawServer, Logger>, 'schemaController'> & {
    schemaController?: {
      bucket: (parentSchemas?: JSONSchema7) => {
        add(
          schema: JSONSchema7,
        ): FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;
        getSchema(schemaId: string): JSONSchema7;
        getSchemas(): Record<string, JSONSchema7>;
      };
      compilersFactory: {
        buildValidator: (
          externalSchemas: JSONSchema7,
          ajvServerOption: Options,
        ) => ({
          schema,
          method,
          url,
          httpPart,
        }: {
          schema: JSONSchema7;
          method: string;
          url: string;
          httpPart: string;
        }) => ValidateFunction<JTDDataType<unknown>>;
        buildSerializer?: (
          externalSchemas: JSONSchema7,
          serializerOptsServerOption: FJSOptions,
        ) => ({
          schema,
          method,
          url,
          httpStatus,
          contentType,
        }: {
          schema: JSONSchema7;
          method: string;
          url: string;
          httpStatus: number;
          contentType: string;
        }) => (data: unknown) => string;
      };
    };
  };

  declare function fastify<
    Server extends http.Server,
    Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
    Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
    Logger extends FastifyBaseLogger = FastifyLoggerInstance,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  >(
    opts: FastifyServerSchemaControllerOptions<Server, Logger>,
  ): FastifyInstance<Server, Request, Reply, Logger, TypeProvider> &
    PromiseLike<FastifyInstance<Server, Request, Reply, Logger, TypeProvider>>;
}
