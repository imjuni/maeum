import { plainJsonSchema } from '@config/json-schema';
import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

/** swagger configuration */
export default function swaggerConfig(): FastifyDynamicSwaggerOptions {
  return {
    openapi: {
      info: {
        title: 'Maeum boilerplate',
        description: 'Maeum boilerplate Swagger Document',
        version: '0.2.0',
      },
      components: {
        schemas: plainJsonSchema as any,
      },
    },
  };
}
