import Ajv, { Options } from 'ajv';
import ajvFormat from 'ajv-formats';

export const ajvOptions: Options = {
  coerceTypes: 'array',
  keywords: ['collectionFormat', 'example', 'binary'],
};

const ajv = new Ajv(ajvOptions);

ajvFormat(ajv);

export default ajv;
