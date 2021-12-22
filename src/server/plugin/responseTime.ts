import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { isEmpty } from 'my-easy-fp';

const symbolRequestTime = Symbol('RequestTimer');
const symbolServerTiming = Symbol('ServerTiming');

/**
 * Decorators
 *
 * @param {fastify} instance
 * @param {function} instance.decorateReply
 * @param {Object} options
 * @param {function} next
 */
function responseTime(
  instance: FastifyInstance,
  options: { digits?: number; header?: string },
  next: (err?: FastifyError) => void,
) {
  const newOptions = { ...options };
  const responseTimeHeaderKey = options.header || 'X-Response-Time';

  // Check the options, and corrects with the default values if inadequate
  if (isEmpty(options.digits) || Number.isNaN(options.digits) || options.digits < 0) {
    newOptions.digits = 2;
  }

  // Hook to be triggered on request (start time)
  instance.addHook('onRequest', (req, reply, onRequestNext: (err?: Error) => void): void => {
    // Store the start timer in nanoseconds resolution
    const reqTo: FastifyRequest & { [symbolRequestTime]?: unknown } = req;
    const replyTo: FastifyReply & { [symbolServerTiming]?: unknown } = reply;

    reqTo[symbolRequestTime] = process.hrtime();
    replyTo[symbolServerTiming] = {};

    onRequestNext();
  });

  // Hook to be triggered just before response to be send
  // eslint-disable-next-line
  instance.addHook(
    'onSend',
    (req, reply, _payload: any, onSendNext: (err?: Error, value?: any) => void) => {
      // Store the start timer in nanoseconds resolution
      const reqTo: FastifyRequest & { [symbolRequestTime]?: [number, number] } = req;
      const replyTo: FastifyReply & { [symbolServerTiming]?: Record<string, unknown> } = reply;

      // check if Server-Timing need to be added
      const serverTiming = replyTo[symbolServerTiming] ?? {};
      const headers = [...Object.values(serverTiming)];

      if (headers.length) {
        reply.header('Server-Timing', headers.join(','));
      }

      // Calculate the duration, in nanoseconds
      const hrDuration = process.hrtime(reqTo[symbolRequestTime]);

      // convert it to milliseconds
      const duration = (hrDuration[0] * 1e3 + hrDuration[1] / 1e6).toFixed(options.digits);

      // add the header to the response
      reply.header(responseTimeHeaderKey, duration);

      onSendNext();
    },
  );

  next();
}

const fastifyResponseTime = fastifyPlugin(responseTime, '>= 0.31');

export default fastifyResponseTime;
