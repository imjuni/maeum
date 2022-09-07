/* eslint-disable import/no-extraneous-dependencies */
import { argv, logger, option, series, task } from 'just-scripts';
import { exec } from 'just-scripts-utils';
import path from 'path';
import * as uuid from 'uuid';

const scriptConfigPath = path.join('.', '.config', 'just.config.ts');

option('env', { default: { env: 'develop' } });

task('schema', async () => {
  const cmd =
    'cross-env DEBUG=maeum:* ts-node -r tsconfig-paths/register --files --project tsconfig.json ./scripts/schema.ts';
  logger.info('schema markdown generator');

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('uid', () => {
  const uid = uuid.v4();

  logger.info('UUID-1: ', uid.replace(/-/g, ''));
  logger.info('UUID-2: ', uid);
});

task('build', async () => {
  const cmd = `cross-env NODE_ENV=production tsc --project ./tsconfig.json  --incremental`;
  logger.info('TypeScript compiler build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('tsc-watch', async () => {
  const cmd = `cross-env NODE_ENV=production tsc --watch --project ./tsconfig.json  --incremental`;
  logger.info('TypeScript compiler build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pack:dev', async () => {
  const cmd = `cross-env NODE_ENV=production webpack --config ${path.join(
    '.config',
    'webpack.config.dev.js',
  )}`;
  logger.info('Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pack:prod', async () => {
  const cmd = `cross-env NODE_ENV=production webpack --config ${path.posix.join(
    '.config',
    'webpack.config.prod.js',
  )}`;
  logger.info('Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('lint', async () => {
  const cmd = `eslint --no-ignore --ext ts,tsx,json ./src/*.ts ./scripts/* ${scriptConfigPath}`;
  logger.info('ESLint: ', cmd);

  const resp = await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });

  // Lint 오류 발생하면 build로 진행 안함
  if (resp !== '') {
    throw new Error(`lint error: \n${resp}`);
  }
});

task('+artifact', async () => {
  const cmd = `cross-env ENV_INCLUDE_NODE_MODULES=on ts-node ./scripts/artifact.ts`;

  logger.info('Artifact create: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+thin-artifact', async () => {
  const cmd = `cross-env ENV_INCLUDE_NODE_MODULES=off ts-node ./scripts/artifact.ts`;

  logger.info('Artifact create: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean', async () => {
  const cmd = `rimraf ./build ./dist ./artifact`;
  logger.info('Clean: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean:log', async () => {
  const cmd = `rimraf ./logs/*`;
  logger.info('Clean Log: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('route', async () => {
  const env = {
    DEBUG: 'frm:*',
    NODE_ENV: 'production',
  };

  const envPrefix = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  const cmd = `cross-env ${envPrefix} fast-maker --config ./.config/.fastmakerrc`;

  logger.info('Script Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('test', async () => {
  const env = {
    DEBUG: 'fb:*',
    ENV_APPLICATION_LOG_LEVEL: 'debug',
  };

  const envPrefix = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  const testPath = argv()._[1] ?? '';
  const cmd = `${envPrefix} jest --color --fail-fast --verbose --tap ${testPath} | tap-notify | tap-nyan`;

  logger.info('jest test: ', cmd, argv()._);

  await exec(cmd, {
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

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('pack:dev', series('clean', 'lint', '+pack:dev'));
task('pack', series('clean', '+pack:prod'));
task('artifact', series('clean', 'lint', '+pack:prod', '+artifact'));
task('thin-artifact', series('clean', 'lint', '+pack:prod', '+thin-artifact'));
