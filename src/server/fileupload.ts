import logging from '@logger/bootstrap';
import { FastifyInstance } from 'fastify';

const log = logging(__filename);

// documentation need fix, prefix '#' character raise reference error
export const fileUploadSchemaId = 'fileUploadSchema';

export function fileuploadCase01(server: FastifyInstance) {
  const fileSchema = server.getSchema(fileUploadSchemaId) as any;
  log.trace('route add case01');

  server.post(
    '/fileupload-case01',
    {
      schema: {
        tags: ['fileupload'],
        description:
          'myFile display expect ui(swagger fileupload widget), but not passed validation',
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          properties: {
            // Case 01
            // myFile display expect ui(swagger fileupload widget), but not passed validation
            myFile: {
              ...fileSchema.properties.filename,
              format: 'binary',
            },
          },
        },
      },
    },
    (req, reply) => {
      log.trace(req.body);
      reply.send('ok');
    },
  );
}

export function fileuploadCase02(server: FastifyInstance) {
  log.trace('route add case02');

  server.post(
    '/fileupload-case02',
    {
      schema: {
        tags: ['fileupload'],
        description: 'myFile display plain object ui',
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          properties: {
            // Case 02
            // myFile display plain object ui
            myFile: {
              $ref: fileUploadSchemaId,
            },
          },
        },
      },
    },
    (req, reply) => {
      log.trace(req.body);
      reply.send('ok');
    },
  );
}

export function fileuploadCase03(server: FastifyInstance) {
  log.trace('route add case03');

  server.post(
    '/fileupload-case03',
    {
      schema: {
        tags: ['fileupload'],
        description: 'myFile display string ui',
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          properties: {
            // Case 03
            // myFile display string ui
            myFile: {
              type: 'object',
              properties: {
                field: {
                  allOf: [{ type: 'string', format: 'binary' }, { $ref: fileUploadSchemaId }],
                },
              },
            },
          },
        },
      },
    },
    (req, reply) => {
      log.trace(req.body);
      reply.send('ok');
    },
  );
}

export function fileuploadCase04(server: FastifyInstance) {
  const fileSchema = server.getSchema(fileUploadSchemaId) as any;
  log.trace('route add case04: ', fileSchema);

  server.post(
    '/fileupload-case04',
    {
      schema: {
        tags: ['fileupload'],
        description: 'working',
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          properties: {
            // Case 04
            // working
            myFile: {
              ...fileSchema.properties.filename,
              type: 'string',
              format: 'binary',
              contentEncoding: 'bindary',
            },
          },
        },
      },
      preValidation(req, _reply, done) {
        const body = req.body as any;

        body.$myFile = body.myFile;
        body.myFile = body.$myFile.filename;

        log.trace(body);

        done();
      },
    },
    (req, reply) => {
      log.trace(req.body);
      reply.send('ok');
    },
  );
}
