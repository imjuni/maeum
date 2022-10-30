import schemas from '@config/json-schema';
import logging from '@logger/bootstrap';
import { FastifyInstance } from 'fastify';
import { isError } from 'my-easy-fp';

const log = logging(__filename);

export default function addServerSchema(fastify: FastifyInstance) {
  try {
    Object.entries(schemas).forEach(([key, definition]) => {
      fastify.addSchema({
        $id: key,
        ...definition.schema,
      });
    });

    log.trace('Scheams: ', Object.keys(fastify.getSchemas()));
  } catch (catched) {
    const err = isError(catched) ?? new Error('getServerSchema unknown error raised');

    log.trace(err.message);
    log.trace(err.stack);
  }
}
