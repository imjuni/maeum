import IConfiguration from '@config/interface/IConfiguration';
import schemas from '@config/json-schema';
import getRunMode from '@config/module/getRunMode';
import readConfigFile from '@config/module/readConfigFile';
import logging from '@logger/bootstrap';
import Ajv from 'ajv';
import { isError, isFalse } from 'my-easy-fp';
import { ReadonlyDeep } from 'type-fest';

const log = logging(__filename);

const internalConfig: IConfiguration = {} as any;
const config: ReadonlyDeep<IConfiguration> = internalConfig;

export async function bootstrap() {
  try {
    const runMode = getRunMode();
    const readedConfig: IConfiguration = readConfigFile(runMode);
    const ajved = new Ajv();

    schemas.IConfiguration.import.from.forEach((schema) => {
      ajved.addSchema(schemas[schema].schema, schemas[schema].id);
    });

    const validator = ajved.compile(schemas.IConfiguration.schema);
    const validationResult = validator(readedConfig);

    if (isFalse(validationResult)) {
      throw new Error(
        `Error occured from, configuration file reading, \n${validator.errors
          ?.map((error) => `${error.instancePath}:${error.message}`)
          ?.join('\n')}`,
      );
    }

    internalConfig.server = readedConfig.server;
    internalConfig.endpoint = readedConfig.endpoint;
  } catch (catched) {
    const err = isError(catched) ?? new Error(`unknown error raised from ${__filename}`);

    log.trace(err.message);
    log.trace(err.stack);

    throw err;
  }
}

export function getConfig(): ReadonlyDeep<IConfiguration> {
  return config;
}

export default config;
