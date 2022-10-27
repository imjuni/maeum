import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

/** swagger ui configuration */
export default function swaggerUiConfig(): FastifySwaggerUiOptions {
  return {
    routePrefix: '/swagger.io',

    uiConfig: {
      deepLinking: true,
      filter: true,
    },
  };
}
