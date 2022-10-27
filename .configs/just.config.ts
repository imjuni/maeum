/* eslint-disable import/no-extraneous-dependencies */
import execa from 'execa';
import { argv, logger, series, task } from 'just-task';
import path from 'path';
import * as uuid from 'uuid';

const DEBUG = 'maeum:*';

function splitArgs(args: string): string[] {
  return args
    .split(' ')
    .map((arg) => arg.trim())
    .filter((arg) => arg != null)
    .filter((arg) => arg !== '');
}

task('uid', () => {
  const uid = uuid.v4();

  logger.info('UUID-1: ', uid.replace(/-/g, ''));
  logger.info('UUID-2: ', uid);
});

task('build', async () => {
  const cmd = `tsc`;
  const option = `--project ./tsconfig.json  --incremental`;

  logger.info('TypeScript compiler build: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      NODE_ENV: 'production',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('tsc-watch', async () => {
  const cmd = `tsc`;
  const option = `--watch --project ./tsconfig.json --incremental`;

  logger.info('TypeScript compiler build: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      NODE_ENV: 'production',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pack:dev', async () => {
  const cmd = `webpack`;
  const option = `--config ${path.join('.configs', 'webpack.config.dev.js')}`;

  logger.info('Build: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      NODE_ENV: 'production',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pack:prod', async () => {
  const cmd = `webpack`;
  const option = `--config ${path.posix.join('.configs', 'webpack.config.prod.js')}`;

  logger.info('Build: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      NODE_ENV: 'production',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('lint', async () => {
  const cmd = 'eslint';
  const option = '--cache .';

  logger.info('ESLint: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      NODE_ENV: 'production',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+artifact', async () => {
  const cmd = 'ts-node';
  const option = './scripts/artifact.ts';

  logger.info('Artifact create: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      NODE_ENV: 'production',
      ENV_INCLUDE_NODE_MODULES: 'on',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+thin-artifact', async () => {
  const cmd = 'ts-node';
  const option = './scripts/artifact.ts';

  logger.info('Artifact create: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      NODE_ENV: 'production',
      ENV_INCLUDE_NODE_MODULES: 'off',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean', async () => {
  const cmd = 'rimraf';
  const option = './build ./dist ./artifact';

  logger.info('Clean: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean:log', async () => {
  const cmd = 'rimraf';
  const option = './logs/*';

  logger.info('Clean Log: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('route', async () => {
  const cmd = 'fast-maker';
  const option = '--config ./.configs/.fastmakerrc';

  logger.info('Script Build: ', cmd, option);

  await execa(cmd, splitArgs(option), {
    env: {
      DEBUG: 'frm:*',
      NODE_ENV: 'production',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('test', async () => {
  const cmd = 'jest';
  const option = '--color --fail-fast --verbose';

  logger.info('jest test: ', cmd, option, argv()._);

  await execa(cmd, splitArgs(option), {
    env: {
      DEBUG,
      ENV_APPLICATION_LOG_LEVEL: 'debug',
    },
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('debug', async () => {
  const args = [
    'cross-env',
    'DEBUG=maeum:*',
    'ENV_APPLICATION_LOG_LEVEL=debug',
    'ENV_ENABLE_CONSOLE_WINSTON=off',
    'TS_NODE_PROJECT=tsconfig.json',
    'TS_NODE_FILES=true',
    'node',
    '-r ts-node/register',
    '-r tsconfig-paths/register',
    '--inspect-brk',
    '--nolazy',
    'src/listen.ts',
  ];
  const cmd = args.join(' ');

  logger.info('debug: ', cmd);

  await execa(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('pack:dev', series('clean', 'lint', '+pack:dev'));
task('pack', series('clean', '+pack:prod'));
task('artifact', series('clean', 'lint', '+pack:prod', '+artifact'));
task('thin-artifact', series('clean', 'lint', '+pack:prod', '+thin-artifact'));
