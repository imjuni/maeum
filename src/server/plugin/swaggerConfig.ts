import config from '@config/config';
import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

/** swagger configuration */
export default function swaggerConfig(): FastifyDynamicSwaggerOptions {
  return {
    routePrefix: '/swagger.io',
    openapi: {
      info: {
        title: 'Maeum boilerplate',
        description: 'Maeum boilerplate Swagger Document',
        version: '0.2.0',
      },
    },

    uiConfig: {
      deepLinking: true,
      filter: true,
    },

    exposeRoute: config.server.runMode !== 'production',
  };
}
