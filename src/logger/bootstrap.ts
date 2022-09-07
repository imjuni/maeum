import getRunMode from '@config/module/getRunMode';
import { ILogFormat } from '@logger/interface/ILogFormat';
import ll from '@logger/ll';
import colorjs, { Color } from 'colors';
import dayjs from 'dayjs';
import fs from 'fs';
import httpStatusCodes from 'http-status-codes';
import { isEmpty, isError } from 'my-easy-fp';
import { existsSync } from 'my-node-fp';
import os from 'os';
import path from 'path';
import winston from 'winston';

let logger: winston.Logger;

const colors: Record<string, Color> = {
  emerg: colorjs.red,
  alert: colorjs.red,
  crit: colorjs.red,
  error: colorjs.red,
  warning: colorjs.yellow,
  notice: colorjs.yellow,
  info: colorjs.blue,
  debug: colorjs.gray,
};

function getLogLevel(level?: string): Extract<keyof winston.config.SyslogConfigSetLevels, string> {
  if (
    level === 'emerg' ||
    level === 'alert' ||
    level === 'crit' ||
    level === 'error' ||
    level === 'warning' ||
    level === 'notice' ||
    level === 'info' ||
    level === 'debug'
  ) {
    return level;
  }

  return 'info';
}

function getFormatter(useColor: boolean = false) {
  if (useColor) {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        try {
          // 메시지를 삭제한다
          const {
            _f: filename,
            message: _message,
            logger: _logger,
            level,
            timestamp: isoTimestamp,
            pid: _pid,
            ...other
          } = info;
          const timestamp = dayjs(isoTimestamp).format('HH:mm:ss.SSS');
          const colorizer = colors[level] ?? colors.gray;

          if (filename === undefined || filename === null) {
            const prefix = colorizer(
              `[${timestamp ?? ''} ${level}${
                isEmpty(other.req_method) ? '' : ` ${other.req_method}`
              }]:`,
            );

            return `${prefix} ${JSON.stringify(other)}`;
          }

          const prefix = `${colorizer(
            `[${timestamp ?? ''} ${level}${
              isEmpty(other.req_method) ? '' : ` ${other.req_method}`
            }`,
          )}${colors.cyan(filename)}${colorizer(']:')}`;

          return `${prefix} ${JSON.stringify(other)}`;
        } catch {
          return '{}';
        }
      }),
    );
  }

  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      try {
        const { message: _message, ...other } = info;
        return JSON.stringify(other);
      } catch {
        return '{}';
      }
    }),
  );
}

export function bootstrap() {
  const runMode = getRunMode();
  const level = getLogLevel(process.env.ENV_LOG_LEVEL);
  const { levels } = winston.config.syslog;

  if (runMode === 'local' && !existsSync(path.join(process.cwd(), 'logs'))) {
    fs.mkdirSync(path.join(process.cwd(), 'logs'), { recursive: true });
  }

  const applogFilename = existsSync('/var/log/nodejs')
    ? '/var/log/nodejs/nodejs.log'
    : './logs/app.log';

  logger = winston.createLogger({
    level,
    levels,
    defaultMeta: { logger: 'app', pid: process.pid },
    transports: [],
  });

  logger.add(
    new winston.transports.File({
      level,
      filename: applogFilename,
      format: getFormatter(),
      eol: os.EOL,
    }),
  );
}

function logging(fullname: string) {
  const filename = path.basename(fullname, '.ts');
  const debugLogger = ll(filename);

  const doLogging = (loggerMethod: winston.LeveledLogMethod, content: Partial<ILogFormat>) => {
    try {
      const status = content.status ?? httpStatusCodes.OK;
      const reqMethod = content.req_method ?? 'SYS';

      const { err_msg, err_stk } =
        content.err !== null && content.err !== undefined
          ? { err_msg: content.err.message, err_stk: content.err.stack }
          : { err_msg: content.err_msg, err_stk: content.err_stk };

      loggerMethod('', {
        ...content,
        status,
        req_method: reqMethod,
        filename,
        err_msg,
        err_stk,
        body: content.body,
      });
    } catch (catched) {
      const err = isError(catched) ?? new Error(`unknown error raised from ${__filename}`);

      console.error(err.message); // eslint-disable-line
      console.error(err.stack); // eslint-disable-line
    }
  };

  return {
    emerg: (content: Partial<ILogFormat>) => doLogging(logger.emerg, content),
    alert: (content: Partial<ILogFormat>) => doLogging(logger.alert, content),
    crit: (content: Partial<ILogFormat>) => doLogging(logger.crit, content),
    error: (content: Partial<ILogFormat>) => doLogging(logger.error, content),
    warning: (content: Partial<ILogFormat>) => doLogging(logger.warning, content),
    notice: (content: Partial<ILogFormat>) => doLogging(logger.notice, content),
    info: (content: Partial<ILogFormat>) => doLogging(logger.info, content),
    debug: (content: Partial<ILogFormat>) => doLogging(logger.debug, content),
    trace: (...args: any[]) => {
      const [first, ...body] = args;
      debugLogger(first, ...body);
    },
  };
}

bootstrap();

export default logging;
