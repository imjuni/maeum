import getRequestDuration from '@logger/module/getRequestDuration';
import { snakeCase } from 'change-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { isFalse } from 'my-easy-fp';
import * as uuid from 'uuid';

export default function httplog(
  req: FastifyRequest,
  _reply: FastifyReply,
): {
  duration: number;
  headers: { [key: string]: string };
  queries: { [key: string]: string };
  params: { [key: string]: string };
  body: { [key: string]: string };
} {
  try {
    const duration = getRequestDuration('X-Response-Time');
    const headers: { [key: string]: string } = (() => {
      const headerRecord = req.headers ?? {};
      return Object.keys(headerRecord).reduce<{ [key: string]: string }>((obj, key) => {
        return {
          ...obj,
          [`hp_${snakeCase(key)}`]:
            headerRecord[key]?.toString() ??
            `header-key-value-is-undefined-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const queries: { [key: string]: string } = (() => {
      const queryRecord: Record<string, string> = (req.query as Record<string, string>) ?? {};
      return Object.keys(queryRecord).reduce<{ [key: string]: string }>((obj, key) => {
        return {
          ...obj,
          [`qp_${snakeCase(key)}`]:
            queryRecord[key]?.toString() ??
            `query-key-value-is-undefined-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const params: { [key: string]: string } = (() => {
      const paramRecord: Record<string, string> = (req.params as Record<string, string>) ?? {};
      return Object.keys(paramRecord).reduce<{ [key: string]: string }>((obj, key) => {
        return {
          ...obj,
          [`pp_${snakeCase(key)}`]:
            paramRecord[key]?.toString() ??
            `params-key-value-is-undefined-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const body: { [key: string]: string } = (() => {
      const bodyRecord = (req.body as any) ?? {}; // eslint-disable-line
      if (typeof req.body === 'object' && isFalse(Array.isArray(req.body))) {
        return Object.keys(bodyRecord).reduce<{ [key: string]: string }>((obj, key) => {
          return {
            ...obj,
            [`bp_${snakeCase(key)}`]:
              bodyRecord[key].toString() ??
              `params-key-value-is-undefined-${uuid.v4().replace(/-/g, '')}`,
          };
        }, {});
      }

      if (typeof req.body === 'object' && Array.isArray(req.body)) {
        const obj = { bp_array: req.body.join(', ') };
        return obj;
      }

      if (
        typeof req.body === 'string' ||
        typeof req.body === 'number' ||
        typeof req.body === 'boolean' ||
        typeof req.body === 'symbol' ||
        typeof req.body === 'bigint'
      ) {
        const obj: { [key: string]: any } = {}; // eslint-disable-line
        obj[`bp_${typeof req.body}`] = req.body.toString();
        return obj;
      }

      const unknownObj = {
        bp_unknown_type: `${req.body}`,
      };

      return unknownObj;
    })();

    return {
      duration,
      headers,
      queries,
      params,
      body,
    };
  } catch (err) {
    return {
      duration: -1,
      headers: {},
      queries: {},
      params: {},
      body: {},
    };
  }
}
