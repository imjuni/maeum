import { JSONSchema7 } from 'json-schema';

const JSC_IRestError: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'error code',
    },
    message: {
      type: 'string',
      description: 'message of error status',
    },
    payload: {},
    status: {
      type: 'number',
      description: 'http status code',
    },
  },
  required: ['code', 'message'],
  definitions: {},
};

export default JSC_IRestError;
