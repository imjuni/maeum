import IDatabaseRecord from '@config/interface/IDatabaseRecord';
import readJsonSchemaFile from '@config/module/readJsonSchemaFile';
import logging from '@logger/bootstrap';
import { isError } from 'my-easy-fp';
import { ReadonlyDeep } from 'type-fest';

const log = logging(__filename);

const internalJsonSchema: Record<string, IDatabaseRecord> = {};
const jsonSchema: ReadonlyDeep<Record<string, IDatabaseRecord>> = internalJsonSchema;

export async function bootstrap() {
  try {
    const readedSchemas: Record<string, IDatabaseRecord> = readJsonSchemaFile();

    Object.entries(readedSchemas)
      .map(([key, value]) => ({ key, value }))
      .forEach((entry) => {
        internalJsonSchema[entry.key] = entry.value;
      });
  } catch (catched) {
    const err = isError(catched) ?? new Error(`unknown error raised from ${__filename}`);

    log.trace(err.message);
    log.trace(err.stack);

    throw err;
  }
}

export function getSchemas(): ReadonlyDeep<Record<string, IDatabaseRecord>> {
  return jsonSchema;
}

export default jsonSchema;
