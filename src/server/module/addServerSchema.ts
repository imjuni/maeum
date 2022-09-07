import logging from '@logger/bootstrap';
import { FastifyInstance } from 'fastify';
import { isError } from 'my-easy-fp';

const log = logging(__filename);

export default async function addServerSchema(fastify: FastifyInstance) {
  try {
    // const definitionsLoaded = await import('../../schema/definitions/definitions');
    // const definitions = definitionsLoaded.default;
    // Object.entries(definitions).forEach(([key, definition]) => {
    //   fastify.addSchema({
    //     $id: key,
    //     ...definition,
    //   });
    // });

    log.trace('Scheams: ', fastify.getSchemas());

    // fastify.addSchema({
    //   $id: 'uuid',
    //   type: 'string',
    //   format: 'uuid',
    // });
  } catch (catched) {
    const err = isError(catched) ?? new Error('getServerSchema unknown error raised');

    log.trace(err.message);
    log.trace(err.stack);
  }
}
