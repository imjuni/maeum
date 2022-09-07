/* eslint-disable no-underscore-dangle */

import { snakeCase } from 'change-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { isFalse } from 'my-easy-fp';
import uuid from 'uuid';

function getDuration(time?: string | string[] | number) {
  if (time == null) {
    return -1;
  }

  if (typeof time === 'number') {
    return time;
  }

  if (Array.isArray(time)) {
    const head = time.at(0);

    if (head == null) {
      return -1;
    }

    const parsed = Number.parseInt(head, 10);
    return Number.isNaN(parsed) ? -1 : parsed;
  }

  const parsed = Number.parseInt(time, 10);
  return Number.isNaN(parsed) ? -1 : parsed;
}

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
    const duration = getDuration('X-Response-Time');
    const headers: { [key: string]: string } = (() => {
      const _head = req.headers ?? {};
      return Object.keys(_head).reduce<{ [key: string]: string }>((obj, key) => {
        return {
          ...obj,
          [`hp_${snakeCase(key)}`]:
            _head[key]?.toString() ??
            `header-key-value-is-undefined-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const queries: { [key: string]: string } = (() => {
      const _query: Record<string, string> = (req.query as Record<string, string>) ?? {};
      return Object.keys(_query).reduce<{ [key: string]: string }>((obj, key) => {
        return {
          ...obj,
          [`qp_${snakeCase(key)}`]:
            _query[key]?.toString() ??
            `query-key-value-is-undefined-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const params: { [key: string]: string } = (() => {
      const _params: Record<string, string> = (req.params as Record<string, string>) ?? {};
      return Object.keys(_params).reduce<{ [key: string]: string }>((obj, key) => {
        return {
          ...obj,
          [`pp_${snakeCase(key)}`]:
            _params[key]?.toString() ??
            `params-key-value-is-undefined-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const body: { [key: string]: string } = (() => {
      const _body = (req.body as any) ?? {}; // eslint-disable-line
      if (typeof req.body === 'object' && isFalse(Array.isArray(req.body))) {
        return Object.keys(_body).reduce<{ [key: string]: string }>((obj, key) => {
          return {
            ...obj,
            [`bp_${snakeCase(key)}`]:
              _body[key].toString() ??
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
